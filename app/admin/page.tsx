import React from "react";
import { db } from "@/database/drizzle";
import { books, users, borrowRecords } from "@/database/schema";
import { eq, desc, count, and } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdminQuickActions from "@/components/admin/AdminQuickActions";
import RecentActivity from "@/components/admin/RecentActivity";

const AdminDashboard = async () => {
  // Get statistics
  const [
    totalBooks,
    totalUsers,
    totalBorrows,
    pendingUsers,
    overdueBooks,
    recentUsers,
    recentBorrows,
    availableBooks,
  ] = await Promise.all([
    // Total books count
    db.select({ count: count() }).from(books),

    // Total users count
    db.select({ count: count() }).from(users),

    // Total borrows count
    db.select({ count: count() }).from(borrowRecords),

    // Pending users count
    db
      .select({ count: count() })
      .from(users)
      .where(eq(users.status, "PENDING")),

    // Overdue books count
    db
      .select({ count: count() })
      .from(borrowRecords)
      .where(and(eq(borrowRecords.status, "BORROWED"))),

    // Recent users (last 5)
    db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        status: users.status,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(5),

    // Recent borrow records (last 5)
    db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        status: borrowRecords.status,
        bookTitle: books.title,
        userName: users.fullName,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .orderBy(desc(borrowRecords.borrowDate))
      .limit(5),

    // Available books count
    db
      .select({
        totalAvailable: count(),
      })
      .from(books)
      .where(eq(books.availableCopies, 0)),
  ]);

  const stats = {
    totalBooks: totalBooks[0]?.count || 0,
    totalUsers: totalUsers[0]?.count || 0,
    totalBorrows: totalBorrows[0]?.count || 0,
    pendingUsers: pendingUsers[0]?.count || 0,
    overdueBooks: overdueBooks[0]?.count || 0,
    outOfStock: availableBooks[0]?.totalAvailable || 0,
  };

  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-400">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening in your library today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="text-sm text-gray-500">
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Books</p>
              <p className="text-3xl font-bold">{stats.totalBooks}</p>
              <p className="text-blue-100 text-xs mt-1">
                In library collection
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Image
                src="/icons/admin/book.svg"
                alt="books"
                width={24}
                height={24}
                className="brightness-0 invert"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
              <p className="text-green-100 text-xs mt-1">Registered members</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Image
                src="/icons/admin/user.svg"
                alt="users"
                width={24}
                height={24}
                className="brightness-0 invert"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Total Borrows
              </p>
              <p className="text-3xl font-bold">{stats.totalBorrows}</p>
              <p className="text-purple-100 text-xs mt-1">All time borrows</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Image
                src="/icons/admin/bookmark.svg"
                alt="borrows"
                width={24}
                height={24}
                className="brightness-0 invert"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">
                Pending Requests
              </p>
              <p className="text-3xl font-bold">{stats.pendingUsers}</p>
              <p className="text-orange-100 text-xs mt-1">Need approval</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Image
                src="/icons/admin/info.svg"
                alt="pending"
                width={24}
                height={24}
                className="brightness-0 invert"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.pendingUsers > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-yellow-800 font-semibold">
                  Account Requests
                </h3>
                <p className="text-yellow-700 text-sm mt-1">
                  {stats.pendingUsers} new user
                  {stats.pendingUsers > 1 ? "s" : ""} waiting for approval
                </p>
              </div>
              <Link href="/admin/account-requests">
                <Button
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Review Requests
                </Button>
              </Link>
            </div>
          </div>
        )}

        {stats.outOfStock > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-800 font-semibold">
                  Out of Stock Books
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  {stats.outOfStock} book{stats.outOfStock > 1 ? "s" : ""}{" "}
                  currently unavailable
                </p>
              </div>
              <Link href="/admin/books">
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Manage Inventory
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <AdminQuickActions />
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <RecentActivity
            recentUsers={recentUsers}
            recentBorrows={recentBorrows}
          />
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-dark-400 mb-4">
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-dark-400">Database</p>
              <p className="text-xs text-gray-500">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-dark-400">Image Storage</p>
              <p className="text-xs text-gray-500">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-dark-400">
                Authentication
              </p>
              <p className="text-xs text-gray-500">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
