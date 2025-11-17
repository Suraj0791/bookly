import booksData from "../public/books.json";
import { books, users } from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { hash } from "bcryptjs";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const seed = async () => {
  console.log("Seeding data...");

  try {
    // Seed demo users
    console.log("Creating demo users...");

    const adminPassword = await hash("admin123", 10);
    const userPassword = await hash("student123", 10);

    // Demo Admin Account
    await db.insert(users).values({
      fullName: "Admin User",
      email: "admin@university.edu",
      universityId: 12345,
      password: adminPassword,
      universityCard: "https://ik.imagekit.io/pwd17k26p/demo/admin-id.jpg",
      status: "APPROVED",
      role: "ADMIN",
    }).onConflictDoNothing();

    // Demo Student Account (Approved)
    await db.insert(users).values({
      fullName: "John Student",
      email: "student@university.edu",
      universityId: 67890,
      password: userPassword,
      universityCard: "https://ik.imagekit.io/pwd17k26p/demo/student-id.jpg",
      status: "APPROVED",
      role: "USER",
    }).onConflictDoNothing();

    console.log("Demo users created successfully!");

    // Seed books with ImageKit URLs already in place
    console.log("Seeding books...");
    for (const book of booksData) {
      await db.insert(books).values({
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        rating: book.rating.toString(),
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        coverUrl: book.coverUrl,
        coverColor: book.coverColor,
        videoUrl: book.videoUrl,
        description: book.description,
        summary: book.summary,
      }).onConflictDoNothing();
    }

    console.log("Data seeded successfully!");
    console.log("\n📚 Demo Accounts:");
    console.log("Admin: admin@university.edu / admin123");
    console.log("Student: student@university.edu / student123");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seed();