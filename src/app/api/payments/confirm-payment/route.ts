import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import {Course} from "@/models/Course";
import {Enrollment} from "@/models/Enrollment";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentIntentId, courseId } = await req.json();
    await connectDB();

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    // Create enrollment
    const enrollment = await Enrollment.create({
      student: session.user.id,
      course: courseId,
      enrolledAt: new Date(),
      completedModules: [],
      overallProgress: 0,
      isCompleted: false,
    });
    
    // Create transaction record
    const transaction = await Transaction.create({
      student: session.user.id,
      instructor: course.instructor,
      course: courseId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      platformFee: parseInt(paymentIntent.metadata.platformFee),
      instructorEarning: parseInt(paymentIntent.metadata.instructorEarning),
      status: "completed",
      paymentMethod: "stripe",
      stripePaymentIntentId: paymentIntentId,
      completedAt: new Date(),
    });
    
    // Update instructor's total earnings
    await User.findByIdAndUpdate(course.instructor, {
      $inc: { totalEarnings: transaction.instructorEarning }
    });
    
    return NextResponse.json({
      success: true,
      enrollment,
      transaction,
      message: "Course purchased successfully!"
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json({ error: "Payment confirmation failed" }, { status: 500 });
  }
}