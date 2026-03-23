import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

/**
 * GET /api/auth/set-role
 *
 * This is the callbackUrl after Google OAuth.
 * The login page stores the chosen role in localStorage as "pending_role".
 * We can't read localStorage server-side, so we pass it as a query param
 * from a client-side redirect page instead.
 *
 * Flow:
 *  1. User picks role on login page → stored in localStorage
 *  2. Google OAuth completes → lands on /api/auth/set-role (this route)
 *  3. This route redirects to /auth/apply-role (client page)
 *  4. Client page reads localStorage, calls POST /api/auth/set-role with role
 *  5. Role saved to DB → redirect to correct dashboard
 */
export async function GET() {
  // Redirect to the client-side page that reads localStorage
  return NextResponse.redirect(
    new URL("/auth/apply-role", process.env.NEXTAUTH_URL || "http://localhost:3000")
  );
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { role } = await req.json();

    // Only allow valid roles
    if (!["student", "instructor"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await connectDB();

    // Only set role if this is a new user (role not yet explicitly set)
    // We detect new users by checking if they were created in the last 60 seconds
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const secondsSinceCreated = (Date.now() - new Date(user.createdAt).getTime()) / 1000;
    const isNewUser = secondsSinceCreated < 120; // within 2 minutes = new registration

    if (isNewUser) {
      user.role = role;
      await user.save();
    }

    const destination = user.role === "instructor"
      ? "/instructor/dashboard"
      : "/student/dashboard";

    return NextResponse.json({ success: true, role: user.role, redirect: destination });
  } catch (err) {
    console.error("set-role error:", err);
    return NextResponse.json({ error: "Failed to set role" }, { status: 500 });
  }
}