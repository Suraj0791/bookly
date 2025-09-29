"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const AdminQuickActions = () => {
  const quickActions = [
    {
      title: "Add New Book",
      description: "Add a new book to the library collection",
      icon: "/icons/admin/plus.svg",
      href: "/admin/books/new",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Review Requests",
      description: "Approve pending account requests",
      icon: "/icons/admin/user.svg",
      href: "/admin/account-requests",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      title: "Manage Borrows",
      description: "Handle book returns and extensions",
      icon: "/icons/admin/bookmark.svg",
      href: "/admin/book-requests",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "View All Books",
      description: "Browse and manage book inventory",
      icon: "/icons/admin/book.svg",
      href: "/admin/books",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: "/icons/admin/users.svg",
      href: "/admin/users",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
    {
      title: "System Settings",
      description: "Configure library settings",
      icon: "/icons/admin/caret-down.svg",
      href: "/admin/settings",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-dark-400 mb-4 flex items-center gap-2">
        <Image
          src="/icons/admin/home.svg"
          alt="quick actions"
          width={20}
          height={20}
        />
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <div className="group flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer">
              <div
                className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center transition-colors duration-200`}
              >
                <Image
                  src={action.icon}
                  alt={action.title}
                  width={20}
                  height={20}
                  className="brightness-0 invert"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-dark-400 group-hover:text-dark-500">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  {action.description}
                </p>
              </div>
              <Image
                src="/icons/admin/caret-down.svg"
                alt="go"
                width={16}
                height={16}
                className="rotate-[-90deg] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">
            Need help getting started?
          </p>
          <Button variant="outline" size="sm" className="w-full">
            <Image
              src="/icons/admin/info.svg"
              alt="help"
              width={16}
              height={16}
              className="mr-2"
            />
            View Admin Guide
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminQuickActions;
