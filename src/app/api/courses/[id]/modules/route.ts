import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course, Module } from "@/models/Course";
import Certificate from "@/models/Certificate";
import { generateCertificate } from "@/lib/certificate/generator";

// POST /api/courses/[id]/modules — add module to course
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "instructor") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { title, order } = body;

    const course = await Course.findOne({ _id: params.id, instructor: session.user.id });
    if (!course) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    const mod = await Module.create({
      course:  params.id,
      title:   title || "New Module",
      order:   order || course.modules.length + 1,
      contentBlocks:    [],
      rewardOnComplete: 25,
    });

    course.modules.push(mod._id as any);
    await course.save();

    return NextResponse.json({ success: true, data: mod }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create module" }, { status: 500 });
  }
}
