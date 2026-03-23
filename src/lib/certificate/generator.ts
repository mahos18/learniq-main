import puppeteer from "puppeteer-core";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "@/lib/cloudinary";
import { format } from "date-fns";

interface CertificateData {
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  completionDate: Date;
}

interface GeneratedCertificate {
  certificateId: string;
  pdfUrl: string;
  imageUrl: string;
  createdAt: Date;
}

export async function generateCertificate(data: CertificateData): Promise<GeneratedCertificate> {
  const certificateId = uuidv4();
  const { userName, courseTitle, completionDate } = data;
  
  // Get the base URL for assets
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  
  // HTML with your certificate background image
  const html = `
  <html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
      }

      .container {
        position: relative;
        width: 1000px;
        height: 700px;
      }

      .bg {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .name {
        position: absolute;
        top: 360px;
        width: 100%;
        text-align: center;
        font-size: 40px;
        font-family: 'Georgia';
        font-weight: bold;
      }

      .course {
        position: absolute;
        top: 430px;
        width: 100%;
        text-align: center;
        font-size: 22px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <img src="http://localhost:3000/certificate-bg.png" class="bg"/>

      <div class="name">${userName}</div>
      <div class="course">${courseTitle}</div>
    </div>
  </body>
  </html>
  `;
  
  // Launch puppeteer
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 
      (process.platform === "win32" 
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        : "/usr/bin/google-chrome"),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  
  // Generate PDF
  const pdfBuffer = await page.pdf({
    width: "1000px",
    height: "700px",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  
  // Take screenshot for image version
  const screenshotBuffer = await page.screenshot({ 
    type: "png", 
    fullPage: true,
  });
  
  await browser.close();
  
  // Upload to Cloudinary
  const [pdfUpload, imageUpload] = await Promise.all([
    new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `certificates/${data.userId}`,
          public_id: certificateId,
          resource_type: "raw",
          format: "pdf",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(pdfBuffer);
    }),
    new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `certificates/${data.userId}`,
          public_id: `${certificateId}_preview`,
          resource_type: "image",
          format: "png",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(screenshotBuffer);
    })
  ]);
  
  return {
    certificateId,
    pdfUrl: (pdfUpload as any).secure_url,
    imageUrl: (imageUpload as any).secure_url,
    createdAt: new Date(),
  };
}