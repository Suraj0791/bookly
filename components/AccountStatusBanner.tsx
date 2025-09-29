import React from "react";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

const AccountStatusBanner = async () => {
  const session = await auth();

  if (!session?.user?.id) return null;

  const [user] = await db
    .select({ status: users.status })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user || user.status === "APPROVED") return null;

  if (user.status === "PENDING") {
    return (
      <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
        <div className="flex items-center">
          <div className="shrink-0">
            <Image
              src="/icons/warning.svg"
              alt="warning"
              width={20}
              height={20}
              className="text-yellow-400"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Account Pending Approval:</span>{" "}
              Your account is currently under review by Library Admin Suraj.
              Once approved, you&apos;ll have full access to borrow books from
              our digital library. Thank you for your patience!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (user.status === "REJECTED") {
    return (
      <div className="mb-6 border-l-4 border-red-400 bg-red-50 p-4">
        <div className="flex items-center">
          <div className="shrink-0">
            <Image
              src="/icons/warning.svg"
              alt="error"
              width={20}
              height={20}
              className="text-red-400"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">
              <span className="font-medium">Account Rejected:</span>{" "}
              Unfortunately, your account application was not approved by
              Library Admin Suraj. Please reach out to the library
              administration for reconsideration or clarification on the
              decision.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AccountStatusBanner;
