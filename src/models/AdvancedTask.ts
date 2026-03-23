import mongoose from "mongoose";

export interface IAdvancedTask {
  _id: string;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  courseTitle: string;
  tasks: {
    step: number;
    title: string;
    description: string;
    hints: string[];
    resources: { label: string; url: string }[];
    completed: boolean;
  }[];
  generatedAt: Date;
  completedAt?: Date;
  overallProgress: number;
}

const AdvancedTaskSchema = new mongoose.Schema<IAdvancedTask>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    courseTitle: { type: String, required: true },
    tasks: [{
      step: { type: Number, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      hints: [{ type: String }],
      resources: [{
        label: { type: String },
        url: { type: String },
      }],
      completed: { type: Boolean, default: false },
    }],
    generatedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    overallProgress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Ensure one task set per user per course
AdvancedTaskSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.AdvancedTask || mongoose.model<IAdvancedTask>("AdvancedTask", AdvancedTaskSchema);