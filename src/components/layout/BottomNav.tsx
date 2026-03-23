"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, BarChart2, Zap, PlusCircle } from "lucide-react";

const studentLinks = [
  { href: "/student/dashboard", label: "Home",     icon: LayoutDashboard },
  { href: "/student/courses",   label: "Courses",  icon: BookOpen },
  { href: "/student/profile",   label: "Analytics",icon: BarChart2 },
  { href: "/student/rewards",   label: "Rewards",  icon: Zap },
];

const instructorLinks = [
  { href: "/instructor/dashboard", label: "Home",   icon: LayoutDashboard },
  { href: "/instructor/courses",   label: "Courses",icon: BookOpen },
  { href: "/instructor/builder",   label: "Create", icon: PlusCircle },
];

export default function BottomNav({ role }: { role: string }) {
  const pathname = usePathname();
  const links = role === "instructor" ? instructorLinks : studentLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "#03112a", borderTop: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "8px 0",
    }}>
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
            padding: "6px 0", textDecoration: "none",
            color: active ? "#4F7FFF" : "#4A5568", transition: "color 0.15s",
          }}>
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: "10px", fontWeight: active ? "700" : "500", letterSpacing: "0.04em" }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
