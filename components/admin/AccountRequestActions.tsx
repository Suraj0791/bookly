"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { updateUserStatus } from "@/lib/admin/actions/user";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  role: "USER" | "ADMIN";
}

interface Props {
  user: User;
}

const AccountRequestActions = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await updateUserStatus(user.id, "APPROVED");

      if (result.success) {
        toast({
          title: "Account Approved",
          description: `${user.fullName} can now access the library`,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An error occurred while approving the account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (loading) return;

    const confirmed = confirm(
      `Are you sure you want to reject ${user.fullName}'s account request?`
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const result = await updateUserStatus(user.id, "REJECTED");

      if (result.success) {
        toast({
          title: "Account Rejected",
          description: `${user.fullName}'s request has been rejected`,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An error occurred while rejecting the account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        size="sm"
        onClick={handleApprove}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white border-0 shadow-sm"
      >
        <Image
          src="/icons/admin/tick.svg"
          alt="approve"
          width={14}
          height={14}
          className="mr-1.5"
        />
        {loading ? "Approving..." : "Approve"}
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={handleReject}
        disabled={loading}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
      >
        <Image
          src="/icons/admin/close.svg"
          alt="reject"
          width={14}
          height={14}
          className="mr-1.5"
        />
        {loading ? "Rejecting..." : "Reject"}
      </Button>
    </div>
  );
};

export default AccountRequestActions;
