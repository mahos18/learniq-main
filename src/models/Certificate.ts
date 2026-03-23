import mongoose from "mongoose";

export interface ICertificate {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  certificateId: string;
  pdfUrl: string;
  imageUrl: string;
  userName: string;
  courseTitle: string;
  completedAt: Date;
  createdAt: Date;
}

const CertificateSchema = new mongoose.Schema<ICertificate>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    certificateId: { type: String, required: true, unique: true },
    pdfUrl: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userName: { type: String, required: true },
    courseTitle: { type: String, required: true },
    completedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Ensure one certificate per user per course
CertificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Certificate || mongoose.model<ICertificate>("Certificate", CertificateSchema);