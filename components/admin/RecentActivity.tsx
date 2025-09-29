import React from "react";
import Image from "next/image";
import Link from "next/link";

interface User {
  id: string;
  fullName: string;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date | null;
}

interface Borrow {
  id: string;
  borrowDate: Date;
  status: "BORROWED" | "RETURNED";
  bookTitle: string;
  userName: string;
}

interface Props {
  recentUsers: User[];
  recentBorrows: Borrow[];
}

const RecentActivity = ({ recentUsers, recentBorrows }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent User Registrations */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-400 flex items-center gap-2">
            <Image
              src="/icons/admin/user.svg"
              alt="users"
              width={20}
              height={20}
            />
            Recent Registrations
          </h3>
          <Link
            href="/admin/users"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-primary-admin rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-400 truncate">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : user.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Image
                src="/icons/admin/user.svg"
                alt="no users"
                width={24}
                height={24}
                className="mx-auto mb-2 opacity-50"
              />
              <p className="text-sm">No recent registrations</p>
            </div>
          )}
        </div>

        {recentUsers.some((user) => user.status === "PENDING") && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">
              Action Required
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              {recentUsers.filter((user) => user.status === "PENDING").length}{" "}
              user(s) need approval
            </p>
          </div>
        )}
      </div>

      {/* Recent Book Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-400 flex items-center gap-2">
            <Image
              src="/icons/admin/bookmark.svg"
              alt="activities"
              width={20}
              height={20}
            />
            Recent Book Activity
          </h3>
          <Link
            href="/admin/book-requests"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {recentBorrows.length > 0 ? (
            recentBorrows.map((borrow) => (
              <div
                key={borrow.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Image
                    src="/icons/admin/book.svg"
                    alt="book"
                    width={16}
                    height={16}
                    className="brightness-0 invert"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-400 truncate">
                    {borrow.bookTitle}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    by {borrow.userName}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      borrow.status === "BORROWED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {borrow.status}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Image
                src="/icons/admin/bookmark.svg"
                alt="no activity"
                width={24}
                height={24}
                className="mx-auto mb-2 opacity-50"
              />
              <p className="text-sm">No recent book activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
