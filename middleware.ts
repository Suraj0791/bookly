export { auth as middleware } from "@/auth";

// Allow public access to landing, demo, and auth pages
export const config = {
    matcher: [
        "/((?!api|landing|demo|_next/static|_next/image|favicon.ico|icons|images|fonts|sign-in|sign-up).*)",
    ],
};