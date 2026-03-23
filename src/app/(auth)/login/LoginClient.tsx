"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { GraduationCap, BookOpen, ChevronDown, Zap, ArrowRight, Check } from "lucide-react";

type Role = "student" | "instructor";

const ROLES = [
  {
    value: "student" as Role,
    label: "Student",
    desc: "I want to learn and master new skills",
    icon: BookOpen,
    color: "#4B7BF5",
    bg: "rgba(75,123,245,0.12)",
    border: "rgba(75,123,245,0.3)",
  },
  {
    value: "instructor" as Role,
    label: "Instructor",
    desc: "I want to create and publish courses",
    icon: GraduationCap,
    color: "#7C5CFC",
    bg: "rgba(124,92,252,0.12)",
    border: "rgba(124,92,252,0.3)",
  },
];

export default function LoginClient() {
  const [role, setRole]         = useState<Role>("student");
  const [loading, setLoading]   = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const selected = ROLES.find((r) => r.value === role)!;

  const handleGoogle = async () => {
    setLoading(true);
    // Store role so the post-OAuth handler can apply it
    localStorage.setItem("pending_role", role);
    await signIn("google", { callbackUrl: "/api/auth/set-role" });
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col" style={{ background: "#070B18" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "#1E2D55" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(75,123,245,0.2)", border: "1px solid rgba(75,123,245,0.3)" }}>
            <Zap size={13} style={{ color: "#4B7BF5" }} />
          </div>
          <span className="font-display font-bold text-bright">LearnIQ</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {["Pathways", "Laboratory", "Vault"].map((l) => (
            <span key={l} className="text-sm text-muted cursor-pointer hover:text-bright transition-colors">{l}</span>
          ))}
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — hero text */}
          <div className="flex flex-col gap-7">
            <div>
              <span className="badge badge-neon mb-5 inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon inline-block" style={{ boxShadow: "0 0 6px #39FF84" }} />
                New Protocol v4.0 Active
              </span>
              <h1 className="font-display font-bold leading-[1.06] mb-5"
                style={{ fontSize: "clamp(38px,5vw,64px)" }}>
                <span style={{ color: "#E8EAF0" }}>Learning that<br />knows </span>
                <span style={{ color: "#4B7BF5" }}>where</span>
                <br />
                <span style={{ color: "#7C5CFC" }}>you&apos;re going</span>
              </h1>
              <p className="text-muted leading-relaxed max-w-sm text-sm">
                Deploy AI-driven educational architectures tailored to your cognitive profile.
                Earn verifiable assets while mastering high-density curricula.
              </p>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A","B","C"].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                    style={{ borderColor: "#070B18", background: ["#4B7BF5","#7C5CFC","#00D4FF"][i], color: "#fff" }}>
                    {l}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted">
                Joined by <span className="font-semibold text-bright">12,400+</span> elite researchers
              </span>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {["AI Study Plans", "Knowledge Graph", "Reward Points", "Skill Radar"].map((f) => (
                <span key={f} className="badge badge-electric text-xs">{f}</span>
              ))}
            </div>
          </div>

          {/* Right — auth card */}
          <div className="card p-7 flex flex-col gap-6" style={{ background: "#0D1226" }}>

            <div>
              <h2 className="font-display font-bold text-bright text-xl mb-1">
                Join the Protocol
              </h2>
              <p className="text-muted text-sm">Choose your role to get started</p>
            </div>

            {/* Role selector */}
            <div>
              <label className="label block mb-3">I am a...</label>

              {/* Role cards */}
              <div className="flex flex-col gap-3">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const active = role === r.value;
                  return (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      className="flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                      style={{
                        background: active ? r.bg : "rgba(30,45,85,0.3)",
                        border: `1.5px solid ${active ? r.border : "#1E2D55"}`,
                      }}
                    >
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: active ? r.bg : "rgba(30,45,85,0.5)", border: `1px solid ${active ? r.border : "#1E2D55"}` }}>
                        <Icon size={18} style={{ color: active ? r.color : "#3D4F70" }} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm"
                          style={{ color: active ? r.color : "#8892A4" }}>
                          {r.label}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: active ? "#8892A4" : "#3D4F70" }}>
                          {r.desc}
                        </p>
                      </div>

                      {/* Check */}
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: active ? r.color : "transparent",
                          border: `2px solid ${active ? r.color : "#1E2D55"}`,
                        }}>
                        {active && <Check size={11} color="#fff" strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "#1E2D55" }} />
              <span className="label text-xs">Continue with</span>
              <div className="flex-1 h-px" style={{ background: "#1E2D55" }} />
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all active:scale-95"
              style={{
                background: loading ? "rgba(75,123,245,0.1)" : "rgba(255,255,255,0.05)",
                border: "1.5px solid rgba(255,255,255,0.1)",
                color: loading ? "#3D4F70" : "#E8EAF0",
              }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = loading ? "rgba(75,123,245,0.1)" : "rgba(255,255,255,0.05)"; }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "#3D4F70", borderTopColor: "transparent" }} />
                  Connecting...
                </>
              ) : (
                <>
                  {/* Google icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google as {selected.label}
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            {/* Role note */}
            <p className="text-center text-xs" style={{ color: "#3D4F70" }}>
              Your role is saved automatically. You can contact support to change it later.
            </p>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-8 py-5 flex items-center justify-center"
        style={{ borderColor: "#1E2D55" }}>
        <p className="label text-xs">© 2025 LearnIQ Protocol. All Systems Operational.</p>
      </div>
    </div>
  );
}