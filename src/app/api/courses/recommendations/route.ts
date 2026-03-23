import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { Course } from "@/models/Course";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body properly
    const body = await req.json();
    const { topic, difficulty } = body;
    
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }
    
    await connectDB();

    // Extract keywords from topic
    const words: string[] = topic.toLowerCase().split(" ");
    const keywords: string[] = words.filter((w: string) => w.length > 3);
    
    // Build search query
    const searchQuery: any = {
      isPublished: true,
      $or: [
        { tags: { $in: keywords } },
        { title: { $regex: topic, $options: "i" } },
        { description: { $regex: topic, $options: "i" } },
      ],
    };
    
    // Add difficulty filter if specified
    if (difficulty && difficulty !== "all") {
      searchQuery.difficulty = difficulty;
    }
    
    // Find courses with search
    const recommendedCourses = await Course.find(searchQuery)
      .populate("instructor", "name image")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // If no results, get trending courses
    if (recommendedCourses.length === 0) {
      const trendingCourses = await Course.find({ isPublished: true })
        .populate("instructor", "name image")
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();
      
      return NextResponse.json({ 
        courses: trendingCourses,
        message: "Showing trending courses" 
      });
    }

    return NextResponse.json({ courses: recommendedCourses });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" }, 
      { status: 500 }
    );
  }
}