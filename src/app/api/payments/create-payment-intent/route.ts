import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import {Course} from "@/models/Course";
import User from "@/models/User";

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

    // For hackathon demo, use test mode
    if (paymentMethod === "points") {
      // Use points system
      const user = await User.findById(session.user.id);
      if (session.user.rewardPoints < course.pointCost) {
        return NextResponse.json({ error: "Insufficient points" }, { status: 400 });
      }
      
      // Deduct points
      await User.findByIdAndUpdate(session.user.id, {
        $inc: { rewardPoints: -course.pointCost }
      });
      
      // Award instructor points (can be converted later)
      await User.findByIdAndUpdate(course.instructor._id, {
        $inc: { rewardPoints: Math.floor(course.pointCost * 0.6) }
      });
      
      return NextResponse.json({ 
        success: true, 
        method: "points",
        message: "Course purchased with points!"
      });
    } 
    
    // For stripe (test mode)
    const amount = course.pricing.amount;
    const platformFee = Math.floor(amount * 0.4);
    const instructorEarning = amount - platformFee;
    
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: course.pricing.currency || "usd",
      metadata: {
        courseId: course._id.toString(),
        studentId: session.user.id,
        instructorId: course.instructor._id.toString(),
        platformFee: platformFee.toString(),
        instructorEarning: instructorEarning.toString(),
      },
      // For hackathon demo, use test card: 4242 4242 4242 4242
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
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}