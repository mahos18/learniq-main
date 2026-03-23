"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Award, Calendar, Share2 } from "lucide-react";
import { format } from "date-fns";

interface CertificateCardProps {
  certificate: {
    _id: string;
    certificateId: string;
    imageUrl: string;
    pdfUrl: string;
    courseTitle: string;
    completedAt: string;
  };
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const [downloading, setDownloading] = useState(false);
  
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/certificates/${certificate.certificateId}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate_${certificate.certificateId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate: ${certificate.courseTitle}`,
          text: `I completed ${certificate.courseTitle} on LearnIQ!`,
          url: certificate.imageUrl,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback - copy URL to clipboard
      await navigator.clipboard.writeText(certificate.imageUrl);
      alert("Certificate link copied to clipboard!");
    }
  };
  
  return (
    <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-amber-500/50 transition-all duration-300">
      {/* Certificate Preview */}
      <div className="relative aspect-[1.4/1] overflow-hidden">
        <img
          src={certificate.imageUrl}
          alt={`Certificate for ${certificate.courseTitle}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors"
          >
            <Download size={20} className="text-white" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors"
          >
            <Share2 size={20} className="text-white" />
          </button>
        </div>
      </div>
      
      {/* Certificate Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Award size={16} className="text-amber-500" />
          <h3 className="font-semibold text-white truncate">
            {certificate.courseTitle}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar size={14} />
          <span>Completed: {format(new Date(certificate.completedAt), "MMM dd, yyyy")}</span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500 font-mono">
            ID: {certificate.certificateId.slice(0, 8)}...
          </p>
        </div>
      </div>
    </div>
  );
}