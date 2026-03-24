import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await connectDB();
    
    const certificates = await Certificate.find({ userId: session.user.id })
      .sort({ completedAt: -1 })
      .lean();
    
    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}