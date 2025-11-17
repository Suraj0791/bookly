import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth();

  // If logged in, show the main app (handled by (root)/page.tsx)
  if (session) {
    // Import and render the home page directly
    const HomePage = (await import("@/app/(root)/page")).default;
    return <HomePage />;
  }

  // Otherwise show public landing page
  const PublicLandingPage = (await import("./landing/page")).default;
  return <PublicLandingPage />;
}
