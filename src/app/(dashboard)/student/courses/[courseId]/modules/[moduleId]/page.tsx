import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course, Module } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import { redirect, notFound } from "next/navigation";
import ModuleViewerClient from "./ModuleViewerClient";

interface Props {
  params: { courseId: string; moduleId: string };
}

export default async function ModuleViewerPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();

  // Check enrollment
  const enrollment = await Enrollment.findOne({
    student: session.user.id,
    course: params.courseId,
  }).lean();

  if (!enrollment) redirect("/student/courses");

  const [course, mod] = await Promise.all([
    Course.findById(params.courseId)
      .populate({ path: "modules", options: { sort: { order: 1 } }, select: "title order _id" })
      .lean(),
    Module.findById(params.moduleId).lean(),
  ]);

  if (!course || !mod) notFound();

  // Strip correctIndex before sending to client
  const safeMod = JSON.parse(JSON.stringify(mod));
  safeMod.contentBlocks?.forEach((block: any) => {
    block.questions?.forEach((q: any) => { delete q.correctIndex; });
  });

  return (
    <ModuleViewerClient
      course={JSON.parse(JSON.stringify(course))}
      mod={safeMod}
      enrollment={JSON.parse(JSON.stringify(enrollment))}
      studentId={session.user.id}
    />
  );
}
