import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";

// GET /api/courses — list all published courses (with filters)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const tag        = searchParams.get("tag");
    const difficulty = searchParams.get("difficulty");
    const search     = searchParams.get("search");

    const query: Record<string, unknown> = { isPublished: true };
    if (tag)        query.tags       = { $in: [tag] };
    if (difficulty) query.difficulty = difficulty;
    if (search)     query.title      = { $regex: search, $options: "i" };

    const courses = await Course.find(query)
      .populate("instructor", "name image")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: courses });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to fetch courses" }, { status: 500 });
  }
}

// POST /api/courses — create new course (instructor only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "instructor") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { title, description, tags, difficulty, pointCost, thumbnail } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: "Title and description required" }, { status: 400 });
    }

    const course = await Course.create({
      title, description, tags: tags || [], difficulty: difficulty || "beginner",
      pointCost: pointCost || 0, thumbnail,
      instructor: session.user.id,
      isPublished: false,
    });

    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to create course" }, { status: 500 });
  }
}
