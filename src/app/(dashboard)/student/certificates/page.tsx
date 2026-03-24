import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";
import CertificateCard from "@/components/certificate/CertificateCard";
import { redirect } from "next/navigation";
import { Award } from "lucide-react";

// Mark this page as dynamic to prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  await connectDB();

  const certificates = await Certificate.find({ 
    userId: session.user.id 
  })
    .sort({ completedAt: -1 })
    .lean();

  // Transform certificates for client component
  const transformedCertificates = certificates.map((cert: any) => ({
    _id: cert._id.toString(),
    certificateId: cert.certificateId,
    imageUrl: cert.imageUrl,
    pdfUrl: cert.pdfUrl,
    courseTitle: cert.courseTitle,
    completedAt: cert.completedAt?.toISOString() || new Date().toISOString(),
  }));

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
      {transformedCertificates.length === 0 ? (
        <div className="text-center py-16 bg-[#0D1226] rounded-xl border border-[#1E2D55]">
          <Award size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Certificates Yet</h3>
          <p className="text-gray-400">
            Complete courses to earn certificates and showcase your achievements!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformedCertificates.map((cert) => (
            <CertificateCard key={cert._id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
}