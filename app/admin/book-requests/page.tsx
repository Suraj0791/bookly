import React from "react";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";
import BookRequestActions from "@/components/admin/BookRequestActions";

const BookRequestsPage = async () => {
  const allRequests = await db
    .select({
      id: borrowRecords.id,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
      bookTitle: books.title,
      bookAuthor: books.author,
      bookCover: books.coverUrl,
      bookColor: books.coverColor,
      userName: users.fullName,
      userEmail: users.email,
      userId: users.id,
      bookId: books.id,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .orderBy(desc(borrowRecords.borrowDate));

  const stats = {
    total: allRequests.length,
    borrowed: allRequests.filter((req) => req.status === "BORROWED").length,
    returned: allRequests.filter((req) => req.status === "RETURNED").length,
    overdue: allRequests.filter(
      (req) =>
        req.status === "BORROWED" &&
        new Date(req.dueDate) < new Date() &&
        !req.returnDate
    ).length,
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark-400">Book Requests</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
          <p className="text-2xl font-bold text-dark-400">{stats.total}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-blue-600">
            Currently Borrowed
          </h3>
          <p className="text-2xl font-bold text-blue-700">{stats.borrowed}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-green-600">Returned</h3>
          <p className="text-2xl font-bold text-green-700">{stats.returned}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-red-600">Overdue</h3>
          <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-dark-400">
            All Book Requests
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrower
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrow Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allRequests.map((request) => {
                const isOverdue =
                  request.status === "BORROWED" &&
                  new Date(request.dueDate) < new Date() &&
                  !request.returnDate;

                return (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-16 rounded flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: request.bookColor }}
                        >
                          {request.bookCover ? (
                            <Image
                              src={request.bookCover}
                              alt={request.bookTitle}
                              width={48}
                              height={64}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            request.bookTitle.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-dark-400">
                            {request.bookTitle}
                          </div>
                          <div className="text-sm text-gray-500">
                            by {request.bookAuthor}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-dark-400">
                          {request.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={isOverdue ? "text-red-600 font-medium" : ""}
                      >
                        {new Date(request.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === "BORROWED"
                            ? isOverdue
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isOverdue ? "OVERDUE" : request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <BookRequestActions
                        requestId={request.id}
                        status={request.status}
                        isOverdue={isOverdue}
                        bookId={request.bookId}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {allRequests.length === 0 && (
        <div className="text-center py-12">
          <Image
            src="/images/no-books.png"
            alt="No requests"
            width={200}
            height={200}
            className="mx-auto mb-4 opacity-50"
          />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            No Book Requests
          </h3>
          <p className="text-gray-400">No books have been borrowed yet.</p>
        </div>
      )}
    </div>
  );
};

export default BookRequestsPage;
