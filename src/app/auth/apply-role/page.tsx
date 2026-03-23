"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";

export default function ApplyRolePage() {
  const router = useRouter();
  const [status, setStatus] = useState("Finalizing your account...");

  useEffect(() => {
    const apply = async () => {
      try {
        // Read the role the user chose before Google OAuth
        const pendingRole = localStorage.getItem("pending_role") || "student";
        localStorage.removeItem("pending_role");

        setStatus(`Setting up your ${pendingRole} account...`);

        const res = await fetch("/api/auth/set-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: pendingRole }),
        });

        const data = await res.json();

        if (data.success) {
          setStatus("Account ready! Redirecting...");
          // Small delay so the user sees the success message
          setTimeout(() => router.push(data.redirect), 800);
        } else {
          // Role setting failed (e.g. existing user) — just go to root which handles redirect
          router.push("/");
        }
      } catch {
        router.push("/");
      }
    };

    apply();
  }, [router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center grid-bg"
      style={{ background: "#070B18" }}
    >
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Animated logo */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
          style={{
            background: "rgba(75,123,245,0.2)",
            border: "1px solid rgba(75,123,245,0.4)",
            boxShadow: "0 0 30px rgba(75,123,245,0.2)",
          }}
        >
          <Zap size={24} style={{ color: "#4B7BF5" }} />
        </div>

        <div>
          <p className="font-display font-bold text-bright text-lg mb-1">LearnIQ</p>
          <p className="text-muted text-sm">{status}</p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{
                background: "#4B7BF5",
                animationDelay: `${i * 0.2}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}