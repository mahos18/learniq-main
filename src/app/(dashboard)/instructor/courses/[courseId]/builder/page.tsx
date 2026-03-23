import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course, Module } from "@/models/Course";
import { redirect, notFound } from "next/navigation";
import BuilderClient from "./BuilderClient";

interface Props { params: { courseId: string } }

export default async function BuilderPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "instructor") redirect("/login");

  await connectDB();
  const course = await Course.findOne({ _id: params.courseId, instructor: session.user.id })
    .populate({ path: "modules", options: { sort: { order: 1 } } })
    .lean();

  if (!course) notFound();

  return <BuilderClient course={JSON.parse(JSON.stringify(course))} />;
}
