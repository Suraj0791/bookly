"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  updateUserStatus,
  updateUserRole,
  deleteUser,
} from "@/lib/admin/actions/user";
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

const UserActionButtons = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (status: "APPROVED" | "REJECTED") => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await updateUserStatus(user.id, status);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
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
        description: "An error occurred while updating user status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (role: "USER" | "ADMIN") => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await updateUserRole(user.id, role);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
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
        description: "An error occurred while updating user role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (loading) return;

    if (!confirm(`Are you sure you want to delete ${user.fullName}?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteUser(user.id);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
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
        description: "An error occurred while deleting user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Status Actions */}
      {user.status === "PENDING" && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusUpdate("APPROVED")}
            disabled={loading}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Image
              src="/icons/admin/tick.svg"
              alt="approve"
              width={12}
              height={12}
              className="mr-1"
            />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusUpdate("REJECTED")}
            disabled={loading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Image
              src="/icons/admin/close.svg"
              alt="reject"
              width={12}
              height={12}
              className="mr-1"
            />
            Reject
          </Button>
        </>
      )}

      {user.status === "APPROVED" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatusUpdate("REJECTED")}
          disabled={loading}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Image
            src="/icons/admin/close.svg"
            alt="reject"
            width={12}
            height={12}
            className="mr-1"
          />
          Reject
        </Button>
      )}

      {user.status === "REJECTED" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatusUpdate("APPROVED")}
          disabled={loading}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <Image
            src="/icons/admin/tick.svg"
            alt="approve"
            width={12}
            height={12}
            className="mr-1"
          />
          Approve
        </Button>
      )}

      {/* Role Actions */}
      {user.role === "USER" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleRoleUpdate("ADMIN")}
          disabled={loading}
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          Make Admin
        </Button>
      )}

      {user.role === "ADMIN" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleRoleUpdate("USER")}
          disabled={loading}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          Make User
        </Button>
      )}

      {/* Delete Action */}
      <Button
        size="sm"
        variant="outline"
        onClick={handleDeleteUser}
        disabled={loading}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Image
          src="/icons/admin/trash.svg"
          alt="delete"
          width={12}
          height={12}
        />
      </Button>
    </div>
  );
};

export default UserActionButtons;
