import mongoose from "mongoose";

export interface ITransaction {
  _id: string;
  student: mongoose.Types.ObjectId;
  instructor: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  platformFee: number;
  instructorEarning: number;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: "stripe" | "points" | "wallet";
  stripePaymentIntentId?: string;
  createdAt: Date;
  completedAt?: Date;
}

const TransactionSchema = new mongoose.Schema<ITransaction>(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    platformFee: { type: Number, required: true },
    instructorEarning: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "pending" },
    paymentMethod: { type: String, enum: ["stripe", "points", "wallet"], required: true },
    stripePaymentIntentId: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);