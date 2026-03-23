import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { RewardTransaction } from "@/models/Enrollment";
import User from "@/models/User";

// GET /api/rewards — current balance + transaction history
export async function GET(_: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const [user, transactions] = await Promise.all([
      User.findById(session.user.id).select("rewardPoints").lean(),
      RewardTransaction.find({ student: session.user.id })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: { balance: user?.rewardPoints || 0, transactions },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
