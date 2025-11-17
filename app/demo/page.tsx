"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Demo page that auto-logs in with demo account
export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const result = await signIn("credentials", {
          email: "student@university.edu",
          password: "student123",
          redirect: false,
        });

        if (result?.ok) {
          // Successful login, redirect to home
          router.push("/");
        } else {
          console.error("Demo auto-login failed:", result?.error);
          // Redirect to sign-in if auto-login fails
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Demo auto-login error:", error);
        router.push("/sign-in");
      }
    };

    autoLogin();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-300">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-bebas-neue text-2xl text-light-100">
          Logging you in as demo user...
        </p>
        <p className="mt-2 text-sm text-light-500">student@university.edu</p>
      </div>
    </div>
  );
}
