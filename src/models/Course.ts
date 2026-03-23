import mongoose, { Schema, Document, Model, Types } from "mongoose";

// ─── Quiz Question (embedded) ────────────────────────────
export interface IQuizQuestion {
  _id:          Types.ObjectId;
  question:     string;
  options:      [string, string, string, string];
  correctIndex: number;   // never sent to client before submit
  topic:        string;   // maps to radar chart axis
  bonusPoints:  number;   // 15 for popup, 25 for end quiz
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  question:     { type: String, required: true },
  options:      { type: [String], required: true, validate: (v: string[]) => v.length === 4 },
  correctIndex: { type: Number, required: true, min: 0, max: 3 },
  topic:        { type: String, required: true },
  bonusPoints:  { type: Number, default: 15 },
});

// ─── Content Block (embedded in Module) ──────────────────
export type ContentBlockType =
  | "pdf" | "youtube" | "video" | "image" | "text"
  | "quiz_popup" | "quiz_end";

export interface IContentBlock {
  _id:       Types.ObjectId;
  type:      ContentBlockType;
  order:     number;
  title?:    string;
  url?:      string;   // pdf / youtube / video / image
  content?:  string;   // markdown text
  questions: IQuizQuestion[];
}

const ContentBlockSchema = new Schema<IContentBlock>({
  type:      { type: String, enum: ["pdf","youtube","video","image","text","quiz_popup","quiz_end"], required: true },
  order:     { type: Number, required: true },
  title:     { type: String },
  url:       { type: String },
  content:   { type: String },
  questions: { type: [QuizQuestionSchema], default: [] },
});

// ─── Module ───────────────────────────────────────────────
export interface IModule extends Document {
  course:           Types.ObjectId;
  title:            string;
  order:            number;
  contentBlocks:    IContentBlock[];
  rewardOnComplete: number;
}

const ModuleSchema = new Schema<IModule>(
  {
    course:           { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title:            { type: String, required: true },
    order:            { type: Number, required: true },
    contentBlocks:    { type: [ContentBlockSchema], default: [] },
    rewardOnComplete: { type: Number, default: 25 },
  },
  { timestamps: true }
);

// ─── Course ───────────────────────────────────────────────
export interface ICourse extends Document {
  title:       string;
  description: string;
  instructor:  Types.ObjectId;
  thumbnail?:  string;
  tags:        string[];
  difficulty:  "beginner" | "intermediate" | "advanced";
  pointCost:   number;
  isPublished: boolean;
  modules:     Types.ObjectId[];
  createdAt:   Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    instructor:  { type: Schema.Types.ObjectId, ref: "User", required: true },
    thumbnail:   { type: String },
    tags:        { type: [String], default: [] },
    difficulty:  { type: String, enum: ["beginner","intermediate","advanced"], default: "beginner" },
    pointCost:   { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    modules:     [{ type: Schema.Types.ObjectId, ref: "Module" }],
  },
  { timestamps: true }
);

export const Module: Model<IModule> =
  mongoose.models.Module || mongoose.model<IModule>("Module", ModuleSchema);

export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
