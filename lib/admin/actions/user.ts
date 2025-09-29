"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const updateUserStatus = async (
    userId: string,
    status: "APPROVED" | "REJECTED" | "PENDING"
) => {
    try {
        await db
            .update(users)
            .set({ status })
            .where(eq(users.id, userId));

        revalidatePath("/admin/users");

        return {
            success: true,
            message: `User ${status.toLowerCase()} successfully`,
        };
    } catch (error) {
        console.error("Error updating user status:", error);
        return {
            success: false,
            message: "Failed to update user status",
        };
    }
};

export const updateUserRole = async (
    userId: string,
    role: "USER" | "ADMIN"
) => {
    try {
        await db
            .update(users)
            .set({ role })
            .where(eq(users.id, userId));

        revalidatePath("/admin/users");

        return {
            success: true,
            message: `User role updated to ${role.toLowerCase()} successfully`,
        };
    } catch (error) {
        console.error("Error updating user role:", error);
        return {
            success: false,
            message: "Failed to update user role",
        };
    }
};

export const deleteUser = async (userId: string) => {
    try {
        await db
            .delete(users)
            .where(eq(users.id, userId));

        revalidatePath("/admin/users");

        return {
            success: true,
            message: "User deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting user:", error);
        return {
            success: false,
            message: "Failed to delete user",
        };
    }
};