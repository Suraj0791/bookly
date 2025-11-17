import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PublicLandingPage from "./landing/page";

export default async function RootPage() {
  const session = await auth();

  // If logged in, redirect to main app
  if (session) {
    redirect("/home");
  }

  // Otherwise show public landing page
  return <PublicLandingPage />;
}
