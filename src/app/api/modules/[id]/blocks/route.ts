import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Module } from "@/models/Course";

// POST /api/modules/[id]/blocks — add a content block
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "instructor") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const block = await req.json();

    const mod = await Module.findByIdAndUpdate(
      params.id,
      { $push: { contentBlocks: block } },
      { new: true }
    );

    if (!mod) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: mod }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to add block" }, { status: 500 });
  }
}
