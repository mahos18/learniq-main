import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import {Course} from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, paymentMethod } = await req.json();
    await connectDB();

    const course = await Course.findById(courseId).populate("instructor");
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // For hackathon demo - simulate successful payment
    if (paymentMethod === "points") {
      const user = await User.findById(session.user.id);
      if (session.user.rewardPoints < course.pointCost) {
        return NextResponse.json({ error: "Insufficient points" }, { status: 400 });
      }
      
      // Deduct points
      await User.findByIdAndUpdate(session.user.id, {
        $inc: { rewardPoints: -course.pointCost }
      });
      
      // Create enrollment
      await Enrollment.create({
        student: session.user.id,
        course: courseId,
        enrolledAt: new Date(),
        completedModules: [],
        overallProgress: 0,
        isCompleted: false,
      });
      
      return NextResponse.json({ 
        success: true, 
        method: "points",
        message: "Course purchased with points!"
      });
    } 
    
    // For hackathon demo, create a test payment intent
    // Use a test amount (in cents)
    const amount = course.pricing?.amount || 2999;
    const platformFee = Math.floor(amount * 0.4);
    const instructorEarning = amount - platformFee;
    
    // For demo purposes, we'll create a payment intent that will succeed with test card
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: course.pricing?.currency || "usd",
      metadata: {
        courseId: course._id.toString(),
        studentId: session.user.id,
        instructorId: course.instructor._id.toString(),
        platformFee: platformFee.toString(),
        instructorEarning: instructorEarning.toString(),
      },
      // For test mode, this will work with test card 4242 4242 4242 4242
      payment_method_types: ['card'],
    });
    
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      platformFee,
      instructorEarning,
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Payment failed" 
    }, { status: 500 });
  }
}