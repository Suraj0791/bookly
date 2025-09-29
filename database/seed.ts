import dummyBooks from "../dummybooks.json";
import ImageKit from "imagekit";
import { books, users } from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { hash } from "bcryptjs";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string,
) => {
  try {
    const response = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });

    return response.filePath;
  } catch (error) {
    console.error("Error uploading image to ImageKit:", error);
  }
};

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
      universityCard: "/demo/admin-id.jpg", // Demo image path
      status: "APPROVED",
      role: "ADMIN",
    }).onConflictDoNothing();

    // Demo Student Account (Approved)
    await db.insert(users).values({
      fullName: "John Student",
      email: "student@university.edu",
      universityId: 67890,
      password: userPassword,
      universityCard: "/demo/student-id.jpg", // Demo image path
      status: "APPROVED",
      role: "USER",
    }).onConflictDoNothing();

    console.log("Demo users created successfully!");

    // Seed books
    console.log("Seeding books...");
    for (const book of dummyBooks) {
      const coverUrl = (await uploadToImageKit(
        book.coverUrl,
        `${book.title}.jpg`,
        "/books/covers",
      )) as string;

      const videoUrl = (await uploadToImageKit(
        book.videoUrl,
        `${book.title}.mp4`,
        "/books/videos",
      )) as string;

      await db.insert(books).values({
        ...book,
        coverUrl,
        videoUrl,
      }).onConflictDoNothing();
    }

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seed();