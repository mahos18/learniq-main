import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  // Convert file to buffer
  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Detect resource type
  const mime = file.type;
  const resourceType = mime.startsWith("video/") ? "video"
                     : mime === "application/pdf" ? "raw"
                     : "image";

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "courses" },
      (err, res) => err ? reject(err) : resolve(res)
    ).end(buffer);
  });

  return NextResponse.json({ url: result.secure_url, resourceType });
}