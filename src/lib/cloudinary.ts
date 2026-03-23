import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type UploadType = "image" | "video" | "raw"; // raw = PDF/docs

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  filename: string,
  type: UploadType = "raw"
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: type,
          folder: "learniq",
          public_id: `${Date.now()}-${filename}`,
          use_filename: true,
        },
        (err, result) => {
          if (err || !result) return reject(err);
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      )
      .end(fileBuffer);
  });
}

export default cloudinary;
