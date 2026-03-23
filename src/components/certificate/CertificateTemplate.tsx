"use client";

import { format } from "date-fns";

interface CertificateTemplateProps {
  name: string;
  courseTitle: string;
  courseId: string;
  completionDate: Date;
  certificateId: string;
}

export default function CertificateTemplate({
  name,
  courseTitle,
  courseId,
  completionDate,
  certificateId,
}: CertificateTemplateProps) {
  return (
    <div className="relative w-[1000px] h-[700px] bg-gradient-to-br from-amber-50 to-white border-8 border-amber-600 rounded-lg shadow-2xl overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-amber-600 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-amber-600 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-amber-600 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-amber-600 rounded-br-lg" />
      
      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-full px-16 text-center">
        {/* Logo/Badge */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
            <span className="text-3xl text-white font-bold">LQ</span>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-5xl font-bold text-amber-700 mb-2 tracking-wide">
          Certificate of Completion
        </h1>
        
        <div className="w-32 h-0.5 bg-amber-400 my-4" />
        
        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-6">
          This is to certify that
        </p>
        
        {/* Name */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4 font-serif">
          {name}
        </h2>
        
        {/* Achievement */}
        <p className="text-lg text-gray-600 mb-2">
          has successfully completed the course
        </p>
        
        {/* Course */}
        <h3 className="text-3xl font-bold text-amber-700 mb-6">
          {courseTitle}
        </h3>
        
        {/* Completion details */}
        <div className="text-gray-500 mb-8">
          <p>Completion Date: {format(completionDate, "MMMM dd, yyyy")}</p>
          <p className="text-sm mt-1">Certificate ID: {certificateId}</p>
        </div>
        
        {/* Signatures */}
        <div className="flex justify-between w-full mt-auto pt-8">
          <div className="text-center">
            <div className="w-40 h-0.5 bg-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Instructor Signature</p>
          </div>
          <div className="text-center">
            <div className="w-40 h-0.5 bg-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Director of Education</p>
          </div>
        </div>
        
        {/* Seal */}
        <div className="absolute bottom-16 right-16 w-24 h-24 rounded-full border-2 border-amber-500 flex items-center justify-center opacity-50">
          <span className="text-amber-500 text-xs text-center leading-tight">
            Verified
            <br />
            LearnIQ
          </span>
        </div>
      </div>
    </div>
  );
}