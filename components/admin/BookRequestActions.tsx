"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  markBookAsReturned,
  extendDueDate,
  sendReminder,
} from "@/lib/admin/actions/bookRequest";
import { toast } from "@/hooks/use-toast";

interface Props {
  requestId: string;
  status: "BORROWED" | "RETURNED";
  isOverdue: boolean;
  bookId: string;
}

const BookRequestActions = ({
  requestId,
  status,
  isOverdue,
  bookId,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleMarkReturned = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await markBookAsReturned(requestId, bookId);

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
        description: "An error occurred while marking book as returned",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExtendDueDate = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await extendDueDate(requestId, 7);

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
        description: "An error occurred while extending due date",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await sendReminder(requestId);

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
        description: "An error occurred while sending reminder",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "RETURNED") {
    return <span className="text-sm text-gray-400 italic">Book returned</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Mark as Returned */}
      <Button
        size="sm"
        variant="outline"
        onClick={handleMarkReturned}
        disabled={loading}
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <Image
          src="/icons/admin/tick.svg"
          alt="mark returned"
          width={12}
          height={12}
          className="mr-1"
        />
        Mark Returned
      </Button>

      {/* Extend Due Date */}
      <Button
        size="sm"
        variant="outline"
        onClick={handleExtendDueDate}
        disabled={loading}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
      >
        <Image
          src="/icons/admin/calendar.svg"
          alt="extend"
          width={12}
          height={12}
          className="mr-1"
        />
        Extend (+7 days)
      </Button>

      {/* Send Reminder (only for overdue) */}
      {isOverdue && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleSendReminder}
          disabled={loading}
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
        >
          <Image
            src="/icons/admin/info.svg"
            alt="reminder"
            width={12}
            height={12}
            className="mr-1"
          />
          Send Reminder
        </Button>
      )}
    </div>
  );
};

export default BookRequestActions;
