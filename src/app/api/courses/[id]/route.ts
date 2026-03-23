import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course, Module } from "@/models/Course";

// GET /api/courses/[id] — full course with populated modules
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const course = await Course.findById(params.id)
      .populate("instructor", "name image")
      .populate({ path: "modules", options: { sort: { order: 1 } } })
      .lean();

    if (!course) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Strip correctIndex from all quiz questions before sending to client
    const safe = JSON.parse(JSON.stringify(course));
    safe.modules?.forEach((mod: any) => {
      mod.contentBlocks?.forEach((block: any) => {
        block.questions?.forEach((q: any) => { delete q.correctIndex; });
      });
    });

    return NextResponse.json({ success: true, data: safe });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch course" }, { status: 500 });
  }
}

// PUT /api/courses/[id] — update course (instructor only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "instructor") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const course = await Course.findOneAndUpdate(
      { _id: params.id, instructor: session.user.id },
      { $set: body },
      { new: true }
    );

    if (!course) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: course });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/courses/[id] — delete course + all its modules
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "instructor") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const course = await Course.findOneAndDelete({ _id: params.id, instructor: session.user.id });
    if (!course) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Delete all child modules
    await Module.deleteMany({ course: params.id });

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}
