import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: "student" | "instructor";
  rewardPoints: number;
  createdAt: Date;
  stripeAccountId?: string;      // For instructors to receive payouts
  stripeCustomerId?: string;     // For students to make payments
  totalEarnings: number;         // Instructor's total earnings from courses
  totalWithdrawn: number;        // Amount instructor has withdrawn
  availableBalance: number;
}

const UserSchema = new Schema<IUser>(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true, lowercase: true },
    image:        { type: String },
    role:         { type: String, enum: ["student", "instructor"], default: "student" },
    rewardPoints: { type: Number, default: 0 },
    stripeAccountId: { type: String }, // For instructors to receive payouts
    stripeCustomerId: { type: String }, // For students to make payments
    totalEarnings: { type: Number, default: 0 }, // Instructor's total earnings
    totalWithdrawn: { type: Number, default: 0 }, // Amount withdrawn
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
