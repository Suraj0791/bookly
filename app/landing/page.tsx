import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import BookCard from "@/components/BookCard";

const PublicLandingPage = async () => {
  // Fetch latest books to display
  const latestBooks = (await db
    .select()
    .from(books)
    .limit(8)
    .orderBy(desc(books.createdAt))) as Book[];

  return (
    <div className="min-h-screen bg-light-100">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary to-blue-600 text-white">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
            <h1 className="text-2xl font-bold">BookWise</h1>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="bg-dark-200 hover:bg-dark-300">
              <Link href="/demo">Try Demo</Link>
            </Button>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Modern University Library Management
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Full-stack library system with admin approval workflows, real-time
            tracking, and automated notifications. Built with Next.js 15,
            TypeScript, and PostgreSQL.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/demo">
                <Image
                  src="/icons/book.svg"
                  alt="demo"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Explore Demo
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/sign-up">Create Account</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-dark-400">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Image
                src="/icons/admin/users.svg"
                alt="auth"
                width={24}
                height={24}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-dark-400">
              Multi-Role Authentication
            </h3>
            <p className="text-gray-600">
              Secure NextAuth.js integration with admin approval workflows and
              role-based access control
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Image
                src="/icons/admin/book.svg"
                alt="books"
                width={24}
                height={24}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-dark-400">
              Real-Time Inventory
            </h3>
            <p className="text-gray-600">
              Live book availability tracking with borrow/return management and
              due date notifications
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Image
                src="/icons/admin/home.svg"
                alt="admin"
                width={24}
                height={24}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-dark-400">
              Admin Dashboard
            </h3>
            <p className="text-gray-600">
              Comprehensive admin panel with user management, analytics, and
              automated workflows
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-dark-400">
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { name: "Next.js 15", desc: "App Router & RSC" },
              { name: "TypeScript", desc: "Type Safety" },
              { name: "PostgreSQL", desc: "Neon Database" },
              { name: "Drizzle ORM", desc: "Type-safe queries" },
              { name: "NextAuth.js", desc: "Authentication" },
              { name: "Redis", desc: "Caching & Rate Limiting" },
              { name: "ImageKit", desc: "File Management" },
              { name: "Upstash", desc: "Workflows & Queue" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="p-4 border rounded-lg hover:shadow-md transition"
              >
                <h4 className="font-semibold text-dark-400">{tech.name}</h4>
                <p className="text-sm text-gray-500">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Books Preview */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-dark-400">
            Library Collection
          </h2>
          <Button asChild>
            <Link href="/demo">View All Books</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestBooks.map((book) => (
            <div key={book.id} className="group cursor-pointer">
              <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition">
                <div
                  className="aspect-[3/4] mb-3 rounded-lg overflow-hidden relative"
                  style={{ backgroundColor: book.coverColor }}
                >
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-dark-400 line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500">{book.author}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Image
                    src="/icons/star.svg"
                    alt="rating"
                    width={16}
                    height={16}
                  />
                  <span className="text-sm font-medium">{book.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Try the demo with pre-populated data or create your own account
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Link href="/demo">Launch Demo</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/sign-up">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-400 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            Built by Suraj • Full-Stack Developer •
            <a
              href="https://github.com/Suraj0791/bookly"
              className="text-primary ml-1 hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLandingPage;
