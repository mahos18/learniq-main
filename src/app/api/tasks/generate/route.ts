import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import AdvancedTask from "@/models/AdvancedTask";
import {Course} from "@/models/Course";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    await connectDB();

    // Check if tasks already exist
    const existingTasks = await AdvancedTask.findOne({
      userId: session.user.id,
      courseId,
    });

    if (existingTasks) {
      return NextResponse.json({ tasks: existingTasks });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Generate advanced tasks using Groq
    const prompt = `You are an expert learning coach. Create advanced self-learning tasks for a student who just completed the course "${course.title}".

Course Description: ${course.description}
Course Tags: ${course.tags?.join(", ") || "General"}

Create 5-7 advanced tasks that:
1. Challenge the student to apply concepts in real-world scenarios
2. Encourage deeper exploration of the subject
3. Include specific resources (GeeksforGeeks, YouTube, official docs)
4. Provide helpful hints for each task

Return ONLY valid JSON with this exact structure:
{
  "tasks": [
    {
      "step": 1,
      "title": "Task title",
      "description": "Detailed task description with specific requirements",
      "hints": [
        "Hint 1 to help the student",
        "Hint 2 that guides without giving answers",
        "Hint 3 for deeper understanding"
      ],
      "resources": [
        {"label": "Resource Name", "url": "https://actual-url.com"},
        {"label": "Another Resource", "url": "https://another-url.com"}
      ]
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = completion.choices[0]?.message?.content;
    let tasks = [];

    if (content) {
      try {
        const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
        tasks = parsed.tasks;
      } catch (error) {
        console.error("Failed to parse Groq response:", error);
        tasks = generateFallbackTasks(course.title);
      }
    } else {
      tasks = generateFallbackTasks(course.title);
    }

    // Save tasks to database
    const advancedTask = await AdvancedTask.create({
      userId: session.user.id,
      courseId: course._id,
      courseTitle: course.title,
      tasks: tasks.map((t: any, idx: number) => ({
        ...t,
        step: idx + 1,
        completed: false,
      })),
      overallProgress: 0,
    });

    return NextResponse.json({ tasks: advancedTask });
  } catch (error) {
    console.error("Error generating tasks:", error);
    return NextResponse.json(
      { error: "Failed to generate tasks" },
      { status: 500 }
    );
  }
}

function generateFallbackTasks(courseTitle: string) {
  return [
    {
      step: 1,
      title: "Build a Real-World Project",
      description: `Create a complete project using the concepts learned in ${courseTitle}. Document your process, challenges, and solutions.`,
      hints: [
        "Start with a simple version, then add complexity",
        "Use version control (Git) to track your progress",
        "Write a README explaining your project",
      ],
      resources: [
        { label: "Project Ideas", url: "https://www.freecodecamp.org/news/project-based-learning/" },
        { label: "Git Tutorial", url: "https://www.youtube.com/watch?v=3RjQznt-8kE" },
      ],
    },
    {
      step: 2,
      title: "Contribute to Open Source",
      description: "Find an open-source project related to the course topic and make a meaningful contribution.",
      hints: [
        "Look for 'good first issue' labels",
        "Read the contribution guidelines carefully",
        "Start with documentation improvements",
      ],
      resources: [
        { label: "First Contributions", url: "https://firstcontributions.github.io/" },
        { label: "GitHub Explore", url: "https://github.com/explore" },
      ],
    },
    // Add more fallback tasks...
  ];
}