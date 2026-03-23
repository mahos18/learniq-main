import mongoose, { Schema, Document, Model, Types } from "mongoose";
import "@/models/Course";

// ─── Enrollment ───────────────────────────────────────────
export interface IEnrollment extends Document {
  student:          Types.ObjectId;
  course:           Types.ObjectId;
  completedModules: Types.ObjectId[];
  overallProgress:  number;  // 0–100 calculated field
  isCompleted:      boolean;
  enrolledAt:       Date;
  completedAt:Date;
}


const EnrollmentSchema = new mongoose.Schema({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  enrolledAt: { type: Date, default: Date.now },
  completedModules: [{ type: Schema.Types.ObjectId, ref: "Module" }],
  overallProgress: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false }, // Add this field
  completedAt: { type: Date }, // Add this field
});

EnrollmentSchema.methods.checkCompletion = function(moduleCount: number) {
  if (this.completedModules.length === moduleCount && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
    return true;
  }
  return false;
};

// Prevent duplicate enrollments
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// ─── Quiz Result ──────────────────────────────────────────
export interface IQuizResult extends Document {
  student:      Types.ObjectId;
  module:       Types.ObjectId;
  course:       Types.ObjectId;
  questionId:   string;
  topic:        string;   // copied from QuizQuestion.topic — powers radar chart
  isCorrect:    boolean;
  pointsEarned: number;
  answeredAt:   Date;
}

const QuizResultSchema = new Schema<IQuizResult>({
  student:      { type: Schema.Types.ObjectId, ref: "User", required: true },
  module:       { type: Schema.Types.ObjectId, ref: "Module", required: true },
  course:       { type: Schema.Types.ObjectId, ref: "Course", required: true },
  questionId:   { type: String, required: true },
  topic:        { type: String, required: true },
  isCorrect:    { type: Boolean, required: true },
  pointsEarned: { type: Number, default: 0 },
  answeredAt:   { type: Date, default: Date.now },
});

// Index for fast radar aggregation
QuizResultSchema.index({ student: 1, topic: 1 });

// ─── Reward Transaction ───────────────────────────────────
export interface IRewardTransaction extends Document {
  student:     Types.ObjectId;
  action:      string;   // "module_complete" | "quiz_pass" | "checkpoint_correct" | "course_complete" | "redeem"
  points:      number;   // positive = earned, negative = spent
  description: string;
  createdAt:   Date;
}

const RewardTransactionSchema = new Schema<IRewardTransaction>(
  {
    student:     { type: Schema.Types.ObjectId, ref: "User", required: true },
    action:      { type: String, required: true },
    points:      { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);

export const QuizResult: Model<IQuizResult> =
  mongoose.models.QuizResult || mongoose.model<IQuizResult>("QuizResult", QuizResultSchema);

export const RewardTransaction: Model<IRewardTransaction> =
  mongoose.models.RewardTransaction || mongoose.model<IRewardTransaction>("RewardTransaction", RewardTransactionSchema);
