import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: "LearnIQ — Elite Learning Protocol",
  description: "Deploy AI-driven educational architectures tailored to your cognitive profile.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0A0F1E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" style={{ background: "#0A0F1E" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
