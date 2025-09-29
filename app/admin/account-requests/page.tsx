import React from "react";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import Image from "next/image";
import ViewIdButton from "@/components/admin/ViewIdButton";
import AccountRequestActions from "@/components/admin/AccountRequestActions";

const AccountRequestsPage = async () => {
  const pendingUsers = await db
    .select()
    .from(users)
    .where(eq(users.status, "PENDING"))
    .orderBy(desc(users.createdAt));

  const allUsers = await db.select().from(users);

  const stats = {
    pending: pendingUsers.length,
    total: allUsers.length,
    approved: allUsers.filter((user) => user.status === "APPROVED").length,
    rejected: allUsers.filter((user) => user.status === "REJECTED").length,
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark-400">Account Requests</h1>
        <div className="text-sm text-gray-500">
          {stats.pending} pending requests
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg shadow border-l-4 border-yellow-400">
          <h3 className="text-sm font-medium text-yellow-700">
            Pending Requests
          </h3>
          <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow border-l-4 border-green-400">
          <h3 className="text-sm font-medium text-green-700">Approved</h3>
          <p className="text-2xl font-bold text-green-800">{stats.approved}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow border-l-4 border-red-400">
          <h3 className="text-sm font-medium text-red-700">Rejected</h3>
          <p className="text-2xl font-bold text-red-800">{stats.rejected}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow border-l-4 border-blue-400">
          <h3 className="text-sm font-medium text-blue-700">Total Users</h3>
          <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
          <h2 className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
            <Image
              src="/icons/admin/info.svg"
              alt="pending"
              width={20}
              height={20}
            />
            Pending Account Requests ({stats.pending})
          </h2>
          <p className="text-sm text-yellow-700 mt-1">
            Review and approve new user registrations to grant library access
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  University Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Card Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-yellow-25">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-admin rounded-full flex items-center justify-center text-white font-semibold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-dark-400">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-dark-400">
                        ID: {user.universityId}
                      </div>
                      <div className="text-sm text-gray-500">
                        Student Registration
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ViewIdButton universityCard={user.universityCard} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AccountRequestActions user={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {pendingUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Image
              src="/icons/admin/tick.svg"
              alt="no pending requests"
              width={32}
              height={32}
              className="text-green-600"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            All Caught Up!
          </h3>
          <p className="text-gray-500 mb-4">
            No pending account requests at the moment.
          </p>
          <div className="text-sm text-gray-400">
            New user registrations will appear here for approval.
          </div>
        </div>
      )}

      {/* Quick Actions Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Image
            src="/icons/admin/info.svg"
            alt="info"
            width={18}
            height={18}
          />
          Account Approval Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-semibold mb-2">✅ Approve when:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Valid university ID card uploaded</li>
              <li>• University ID matches registration details</li>
              <li>• Email domain matches university domain</li>
              <li>• All information appears legitimate</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">❌ Reject when:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Invalid or fake ID card</li>
              <li>• Mismatched information</li>
              <li>• Suspicious registration details</li>
              <li>• Non-university email address</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountRequestsPage;
