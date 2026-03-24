import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course, Module } from "@/models/Course";
import { Enrollment, RewardTransaction } from "@/models/Enrollment";
import User from "@/models/User";
import Certificate from "@/models/Certificate";
import { generateCertificate } from "@/lib/certificate/generator";

// POST /api/progress — mark a module complete, award points, update overall progress
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { moduleId, courseId } = await req.json();

    const [mod, enrollment, course] = await Promise.all([
      Module.findById(moduleId),
      Enrollment.findOne({ student: session.user.id, course: courseId }),
      Course.findById(courseId),
    ]);

    if (!mod || !enrollment || !course) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    // Already completed — idempotent
    const alreadyDone = enrollment.completedModules
      .map((id: any) => id.toString())
      .includes(moduleId);

    if (alreadyDone) {
      return NextResponse.json({ success: true, data: { alreadyCompleted: true } });
    }

    // Add to completed modules
    enrollment.completedModules.push(moduleId);

    // Recalculate progress
    const totalModules = course.modules.length;
    const doneCount = enrollment.completedModules.length;
    enrollment.overallProgress = Math.round((doneCount / totalModules) * 100);
    const wasCompleted = enrollment.isCompleted;
    enrollment.isCompleted = doneCount === totalModules;
    
    // If course is now completed, set completedAt
    if (enrollment.isCompleted && !wasCompleted) {
      enrollment.completedAt = new Date();
    }
    
    await enrollment.save();

    // Award points for module completion
    const pts = mod.rewardOnComplete || 25;
    await User.findByIdAndUpdate(session.user.id, { $inc: { rewardPoints: pts } });
    await RewardTransaction.create({
      student: session.user.id,
      action: "module_complete",
      points: pts,
      description: `Completed module: ${mod.title}`,
    });

    // Bonus points and certificate if course fully completed
    let bonusPoints = 0;
    let certificate = null;
    
    if (enrollment.isCompleted && !wasCompleted) {
      // Award bonus points
      bonusPoints = 100;
      await User.findByIdAndUpdate(session.user.id, { $inc: { rewardPoints: 100 } });
      await RewardTransaction.create({
        student: session.user.id,
        action: "course_complete",
        points: 100,
        description: `Completed course: ${course.title}`,
      });
      
      // Get user details for certificate
      const user = await User.findById(session.user.id);
      
      // Check if certificate already exists (shouldn't, but just in case)
      const existingCert = await Certificate.findOne({
        userId: session.user.id,
        courseId: course._id,
      });
      
      if (!existingCert) {
        try {
          // Generate certificate
          certificate = await generateCertificate({
            userId: session.user.id,
            userName: session.user.name,
            courseId: course._id.toString(),
            courseTitle: course.title,
            completionDate: new Date(),
          });
          
          // Save certificate to database
          await Certificate.create({
            userId: session.user.id,
            courseId: course._id,
            certificateId: certificate.certificateId,
            pdfUrl: certificate.pdfUrl,
            imageUrl: certificate.imageUrl,
            userName: session.user.name,
            courseTitle: course.title,
            completedAt: new Date(),
          });
        } catch (certError) {
          console.error("Certificate generation error:", certError);
          // Don't fail the module completion if certificate generation fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        pointsEarned: pts,
        bonusPoints,
        overallProgress: enrollment.overallProgress,
        isCompleted: enrollment.isCompleted,
        certificate: certificate ? {
          id: certificate.certificateId,
          pdfUrl: certificate.pdfUrl,
          imageUrl: certificate.imageUrl,
        } : null,
        message: enrollment.isCompleted && !wasCompleted 
          ? "🎉 Congratulations! You've completed the course! Certificate generated."
          : `✅ Module completed! +${pts} IQ Points`,
      },
    });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update progress" }, { status: 500 });
  }
}