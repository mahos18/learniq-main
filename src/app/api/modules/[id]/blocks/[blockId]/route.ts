import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Module } from "@/models/Course";

// DELETE /api/modules/[id]/blocks/[blockId]
export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string; blockId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "instructor") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const mod = await Module.findByIdAndUpdate(
      params.id,
      { $pull: { contentBlocks: { _id: params.blockId } } },
      { new: true }
    );

    if (!mod) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: mod });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete block" }, { status: 500 });
  }
}
