import { redirect } from "next/navigation";
import { signIn } from "@/auth";

// Demo page that auto-logs in with demo account
export default async function DemoPage() {
  // Auto sign-in with demo student account
  try {
    await signIn("credentials", {
      email: "student@university.edu",
      password: "student123",
      redirect: false,
    });
  } catch (error) {
    console.error("Demo auto-login failed:", error);
  }

  // Redirect to main app
  redirect("/");
}
