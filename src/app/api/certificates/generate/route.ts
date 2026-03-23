import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";
import { Enrollment } from "@/models/Enrollment";
import {Course} from "@/models/Course";
import User from "@/models/User";
import { generateCertificate } from "@/lib/certificate/generator";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { courseId } = await req.json();
    await connectDB();
    
    // Check if user has completed the course
    const enrollment = await Enrollment.findOne({
      student: session.user.id,
      course: courseId,
      isCompleted: true,
    });
    
    if (!enrollment) {
      return NextResponse.json(
        { error: "Course not completed. Complete all modules first." },
        { status: 400 }
      );
    }
    
    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      userId: session.user.id,
      courseId,
    });
    
    if (existingCertificate) {
      return NextResponse.json({
        certificate: existingCertificate,
        message: "Certificate already exists",
      });
    }
    
    // Get user and course details
    const user = await User.findById(session.user.id);
    const course = await Course.findById(courseId);
    
    if (!user || !course) {
      return NextResponse.json({ error: "User or course not found" }, { status: 404 });
    }
    
    // Generate certificate
    const certificate = await generateCertificate({
      userId: session.user.id,
      userName: user.name,
      courseId,
      courseTitle: course.title,
      completionDate: enrollment.completedAt || new Date(),
    });
    
    // Save to database
    const newCertificate = await Certificate.create({
      userId: session.user.id,
      courseId,
      certificateId: certificate.certificateId,
      pdfUrl: certificate.pdfUrl,
      imageUrl: certificate.imageUrl,
      userName: user.name,
      courseTitle: course.title,
      completedAt: enrollment.completedAt || new Date(),
    });
    
    return NextResponse.json({
      certificate: newCertificate,
      message: "Certificate generated successfully",
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}