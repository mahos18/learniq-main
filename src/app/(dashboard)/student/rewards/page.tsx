import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { RewardTransaction } from "@/models/Enrollment";
import { Course } from "@/models/Course";
import RewardsClient from "./RewardsClient";

export default async function RewardsPage() {
  const session = await getServerSession(authOptions);
  await connectDB();

  const [transactions, redeemableCourses] = await Promise.all([
    RewardTransaction.find({ student: session!.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    Course.find({ isPublished: true, pointCost: { $gt: 0 } })
      .populate("instructor", "name")
      .lean(),
  ]);

  return (
    <RewardsClient
      points={session!.user.rewardPoints}
      transactions={JSON.parse(JSON.stringify(transactions))}
      courses={JSON.parse(JSON.stringify(redeemableCourses))}
    />
  );
}
