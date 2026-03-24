import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { generateCertificate } from "@/lib/certificate/generator";
import Certificate from "@/models/Certificate";
import {Course} from "@/models/Course";
import User from "@/models/User";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    await connectDB();

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({
      userId: session.user.id,
      courseId,
    });

    if (existingCert) {
      return NextResponse.json({ certificate: existingCert });
    }

    const course = await Course.findById(courseId);
    const user = await User.findById(session.user.id);

    if (!course || !user) {
      return NextResponse.json({ error: "Course or user not found" }, { status: 404 });
    }

    const certificate = await generateCertificate({
      userId: session.user.id,
      userName: user.name,
      courseId: course._id.toString(),
      courseTitle: course.title,
      completionDate: new Date(),
    });

    const newCertificate = await Certificate.create({
      userId: session.user.id,
      courseId: course._id,
      certificateId: certificate.certificateId,
      pdfUrl: certificate.pdfUrl,
      imageUrl: certificate.imageUrl,
      userName: user.name,
      courseTitle: course.title,
      completedAt: new Date(),
    });

    return NextResponse.json({ certificate: newCertificate });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}