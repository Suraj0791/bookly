import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";

const PublicLandingPage = async () => {
  const latestBooks = (await db
    .select()
    .from(books)
    .limit(8)
    .orderBy(desc(books.createdAt))) as Book[];

  return (
    <div className="min-h-screen bg-dark-300">
      {/* Hero Section */}
      <header className="bg-dark-300">
        <nav className="container mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
            <h1 className="font-bebas-neue text-3xl text-primary">BookWise</h1>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="border-dark-600 bg-dark-200 text-light-100 hover:bg-dark-600"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="form-btn">
              <Link href="/demo">Try Demo</Link>
            </Button>
          </div>
        </nav>

        <div className="container mx-auto max-w-7xl px-6 pt-16 pb-32">
          <div className="text-center">
            <h1 className="font-bebas-neue text-7xl text-white mb-6 leading-tight">
              MODERN UNIVERSITY
              <br />
              LIBRARY MANAGEMENT
            </h1>
            <p className="text-xl text-light-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              Full-stack library system with admin approval workflows, real-time
              tracking, and automated notifications. Built with Next.js 15,
              TypeScript, and PostgreSQL.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="form-btn text-xl px-10 py-6">
                <Link href="/demo">
                  <Image
                    src="/icons/book.svg"
                    alt="demo"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  Explore Demo
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-dark-100 text-xl px-10 py-6 font-bebas-neue"
              >
                <Link href="/sign-up">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-bebas-neue text-5xl text-center mb-16 text-white">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "/icons/user.svg",
              title: "Multi-Role Authentication",
              desc: "Secure NextAuth.js integration with admin approval workflows and role-based access control",
            },
            {
              icon: "/icons/book-2.svg",
              title: "Real-Time Inventory",
              desc: "Live book availability tracking with borrow/return management and due date notifications",
            },
            {
              icon: "/icons/home.svg",
              title: "Admin Dashboard",
              desc: "Comprehensive admin panel with user management, analytics, and automated workflows",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-dark-200 p-8 rounded-xl border border-dark-600 hover:border-primary transition"
            >
              <div className="w-14 h-14 bg-dark-600 rounded-lg flex items-center justify-center mb-6">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={28}
                  height={28}
                />
              </div>
              <h3 className="font-bebas-neue text-2xl mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-light-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-dark-200 py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <h2 className="font-bebas-neue text-5xl text-center mb-16 text-white">
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Next.js 15", desc: "App Router & RSC" },
              { name: "TypeScript", desc: "Type Safety" },
              { name: "PostgreSQL", desc: "Neon Database" },
              { name: "Drizzle ORM", desc: "Type-safe queries" },
              { name: "NextAuth.js", desc: "Authentication" },
              { name: "Redis", desc: "Rate Limiting" },
              { name: "ImageKit", desc: "File Management" },
              { name: "Upstash", desc: "Workflows" },
            ].map((tech, i) => (
              <div
                key={i}
                className="bg-dark-300 p-6 rounded-lg border border-dark-600 hover:border-primary transition text-center"
              >
                <h4 className="font-bebas-neue text-xl text-primary mb-1">
                  {tech.name}
                </h4>
                <p className="text-sm text-light-500">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Books Preview */}
      <section className="container mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-bebas-neue text-5xl text-white">
            Library Collection
          </h2>
          <Button asChild className="form-btn">
            <Link href="/demo">View All Books</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {latestBooks.map((book) => (
            <Link key={book.id} href="/demo" className="group">
              <div className="bg-dark-200 p-4 rounded-xl border border-dark-600 hover:border-primary transition">
                <div
                  className="aspect-[3/4] mb-4 rounded-lg overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: book.coverColor }}
                >
                  {book.coverUrl &&
                  !book.coverUrl.startsWith("/books/covers/") ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      width={200}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <p className="font-bebas-neue text-2xl text-white/90 mb-2">
                        {book.title}
                      </p>
                      <p className="text-sm text-white/60">{book.author}</p>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-white line-clamp-1 mb-1">
                  {book.title}
                </h3>
                <p className="text-sm text-light-500 line-clamp-1">
                  {book.author}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Image
                    src="/icons/star.svg"
                    alt="rating"
                    width={16}
                    height={16}
                  />
                  <span className="text-sm font-medium text-light-100">
                    {book.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-300 py-20">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <h2 className="font-bebas-neue text-6xl text-white mb-6">
            Ready to Explore?
          </h2>
          <p className="text-xl text-light-100 mb-10 max-w-2xl mx-auto">
            Try the demo with pre-populated data or create your own account
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="form-btn text-xl px-10 py-6">
              <Link href="/demo">Launch Demo</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-dark-100 text-xl px-10 py-6 font-bebas-neue"
            >
              <Link href="/sign-up">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-500 py-10">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/icons/logo.svg" alt="logo" width={32} height={32} />
            <span className="font-bebas-neue text-2xl text-primary">
              BookWise
            </span>
          </div>
          <p className="text-light-500">
            Built by Suraj • Full-Stack Developer
          </p>
          <a
            href="https://github.com/Suraj0791/bookly"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline mt-2 inline-block"
          >
            View on GitHub →
          </a>
        </div>
      </footer>
    </div>
  );
};

export default PublicLandingPage;
