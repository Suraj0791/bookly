"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const markBookAsReturned = async (requestId: string, bookId: string) => {
    try {
        // Update the borrow record to returned status
        await db
            .update(borrowRecords)
            .set({
                status: "RETURNED",
                returnDate: new Date().toISOString().split('T')[0] // Current date as string
            })
            .where(eq(borrowRecords.id, requestId));

        // Increment available copies
        const book = await db
            .select({ availableCopies: books.availableCopies })
            .from(books)
            .where(eq(books.id, bookId))
            .limit(1);

        if (book.length > 0) {
            await db
                .update(books)
                .set({ availableCopies: book[0].availableCopies + 1 })
                .where(eq(books.id, bookId));
        }

        revalidatePath("/admin/book-requests");

        return {
            success: true,
            message: "Book marked as returned successfully",
        };
    } catch (error) {
        console.error("Error marking book as returned:", error);
        return {
            success: false,
            message: "Failed to mark book as returned",
        };
    }
};

export const extendDueDate = async (requestId: string, additionalDays: number = 7) => {
    try {
        // Get current due date
        const record = await db
            .select({ dueDate: borrowRecords.dueDate })
            .from(borrowRecords)
            .where(eq(borrowRecords.id, requestId))
            .limit(1);

        if (record.length === 0) {
            return {
                success: false,
                message: "Borrow record not found",
            };
        }

        // Extend due date by additional days
        const currentDueDate = new Date(record[0].dueDate);
        const newDueDate = new Date(currentDueDate);
        newDueDate.setDate(newDueDate.getDate() + additionalDays);

        await db
            .update(borrowRecords)
            .set({ dueDate: newDueDate.toISOString().split('T')[0] })
            .where(eq(borrowRecords.id, requestId));

        revalidatePath("/admin/book-requests");

        return {
            success: true,
            message: `Due date extended by ${additionalDays} days`,
        };
    } catch (error) {
        console.error("Error extending due date:", error);
        return {
            success: false,
            message: "Failed to extend due date",
        };
    }
};

export const sendReminder = async (requestId: string) => {
    try {
        // This would typically send an email or notification
        // For now, we'll just simulate the action
        console.log(`Reminder sent for request ${requestId}`);

        return {
            success: true,
            message: "Reminder sent successfully",
        };
    } catch (error) {
        console.error("Error sending reminder:", error);
        return {
            success: false,
            message: "Failed to send reminder",
        };
    }
};