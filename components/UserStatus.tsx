import React from "react";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const UserStatus = async () => {
  const session = await auth();

  if (!session?.user?.id) return null;

  const [user] = await db
    .select({ status: users.status, fullName: users.fullName })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) return null;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
          text: "Pending Approval",
          icon: "⏳",
        };
      case "APPROVED":
        return {
          color: "bg-green-100 text-green-800 border-green-300",
          text: "Approved",
          icon: "✅",
        };
      case "REJECTED":
        return {
          color: "bg-red-100 text-red-800 border-red-300",
          text: "Account Rejected",
          icon: "❌",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-300",
          text: "Unknown Status",
          icon: "❓",
        };
    }
  };

  const statusInfo = getStatusInfo(user.status || "PENDING");

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-dark-400">
        Welcome, <span className="font-medium">{user.fullName}</span>
      </div>
      <div
        className={`border px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        <span className="mr-1">{statusInfo.icon}</span>
        {statusInfo.text}
      </div>
    </div>
  );
};

export default UserStatus;
