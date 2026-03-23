"use client";

import { useState, useEffect } from "react";
import { Award, Loader2 } from "lucide-react";
import CertificateCard from "@/components/certificate/CertificateCard";

interface Certificate {
  _id: string;
  certificateId: string;
  imageUrl: string;
  pdfUrl: string;
  courseTitle: string;
  completedAt: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCertificates();
  }, []);
  
  const fetchCertificates = async () => {
    try {
      const response = await fetch("/api/certificates");
      const data = await response.json();
      setCertificates(data.certificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-amber-500" />
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Award size={32} className="text-amber-500" />
          <h1 className="font-display font-bold text-bright text-3xl">
            My Certificates
          </h1>
        </div>
        <p className="text-muted">
          Celebrate your achievements! Download and share your course completion certificates.
        </p>
      </div>
      
      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="text-center py-16 bg-[#0D1226] rounded-xl border border-[#1E2D55]">
          <Award size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Certificates Yet</h3>
          <p className="text-gray-400">
            Complete courses to earn certificates and showcase your achievements!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard key={cert._id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
}