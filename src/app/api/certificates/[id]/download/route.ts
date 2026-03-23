import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await connectDB();
    
    const certificate = await Certificate.findOne({
      certificateId: params.id,
      userId: session.user.id,
    });
    
    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }
    
    // Fetch PDF from Cloudinary
    const response = await fetch(certificate.pdfUrl);
    const pdfBuffer = await response.arrayBuffer();
    
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate_${certificate.courseTitle.replace(/\s+/g, "_")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Certificate download error:", error);
    return NextResponse.json(
      { error: "Failed to download certificate" },
      { status: 500 }
    );
  }
}