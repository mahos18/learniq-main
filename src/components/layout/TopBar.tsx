"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { Bell, Search, Coins } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  user: { name: string; email: string; image?: string; rewardPoints: number };
}

export default function TopBar({ user }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
      style={{ background: "#0A0F1E", borderColor: "#1E2D55" }}>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
        style={{ background: "#0D1226", border: "1px solid #1E2D55", minWidth: 260 }}>
        <Search size={14} style={{ color: "#3D4F70" }} />
        <span style={{ color: "#3D4F70" }}>Search protocol...</span>
      </div>

      {/* Mobile logo */}
      <span className="md:hidden font-display font-bold text-bright">LearnIQ</span>

      <div className="flex items-center gap-3">
        {/* Points */}
        <div className="points-chip">
          <Coins size={13} />
          <span>{user.rewardPoints.toLocaleString()}</span>
          <span className="label" style={{ fontSize: "9px" }}>XP</span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-surface"
          style={{ border: "1px solid #1E2D55" }}>
          <Bell size={15} style={{ color: "#8892A4" }} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "#4B7BF5", boxShadow: "0 0 6px #4B7BF5" }} />
        </button>

        {/* Avatar */}
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {user.image
              ? <Image src={user.image} alt={user.name} width={32} height={32} className="rounded-full" style={{ border: "1.5px solid #1E2D55" }} />
              : <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm"
                  style={{ background: "rgba(75,123,245,0.2)", border: "1.5px solid rgba(75,123,245,0.3)", color: "#7BA7FF" }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
            }
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 w-52 card py-1 z-50 animate-fade-up"
              style={{ background: "#0D1226" }}>
              <div className="px-3 py-2 border-b" style={{ borderColor: "#1E2D55" }}>
                <p className="text-sm font-medium text-bright truncate">{user.name}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors"
                style={{ color: "#FF6B7A" }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
