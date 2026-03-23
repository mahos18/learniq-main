"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, BarChart2, Users, Settings, HelpCircle, LogOut, Zap, PlusCircle } from "lucide-react";
import { signOut } from "next-auth/react";

const studentLinks = [
  { href: "/student/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/student/courses",   label: "Courses",  icon: BookOpen },
  { href: "/student/profile",   label: "Analytics",   icon: BarChart2 },
  { href: "/student/rewards",   label: "Rewards",     icon: Zap },
  { href: "#",                  label: "LearnIq Planner",   icon: Users },
  { href: "#",                  label: "Settings",    icon: Settings },
];

const instructorLinks = [
  { href: "/instructor/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/instructor/courses",   label: "Courses", icon: BookOpen },
  { href: "/instructor/builder",   label: "New Course", icon: PlusCircle },
  { href: "#",                     label: "LearnIq Planner",  icon: BarChart2 },
  { href: "#",                     label: "Settings",   icon: Settings },
];

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const links = role === "instructor" ? instructorLinks : studentLinks;

  return (
    <aside className="hidden md:flex w-56 flex-col min-h-screen sticky top-0 border-r"
      style={{ background: "#0A0F1E", borderColor: "#1E2D55" }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "#1E2D55" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(75,123,245,0.2)", border: "1px solid rgba(75,123,245,0.3)" }}>
            <Zap size={14} style={{ color: "#4B7BF5" }} />
          </div>
          <div>
            <p className="font-display font-bold text-sm" style={{ color: "#E8EAF0" }}>LearnIQ</p>
            <p className="label" style={{ fontSize: "9px" }}>Elite Protocol</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href !== "#" && pathname.startsWith(href);
          return (
            <Link key={`${href}-${label}`} href={href}
              className={cn("nav-item", active && "active")}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      <div className="mx-3 mb-4 p-3 rounded-lg" style={{ background: "rgba(75,123,245,0.06)", border: "1px solid rgba(75,123,245,0.15)" }}>
        <p className="label mb-1">Pro Access</p>
        <p className="text-xs mb-3" style={{ color: "#8892A4" }}>Unlock advanced algorithmic challenges.</p>
        <button className="btn-pulse w-full justify-center text-xs py-2 px-3">
          Upgrade to Pro
        </button>
      </div>

      {/* Bottom links */}
      <div className="px-3 pb-5 border-t pt-3 flex flex-col gap-0.5" style={{ borderColor: "#1E2D55" }}>
        <button className="nav-item w-full text-left">
          <HelpCircle size={15} /> Support
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="nav-item w-full text-left"
          style={{ color: "#FF6B7A" }}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}
