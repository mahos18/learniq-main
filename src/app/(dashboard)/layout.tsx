import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
  <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    <Sidebar role={session.user.role} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <TopBar user={session.user} />
      <main style={{ 
        flex: 1, 
        padding: "28px 28px", 
        paddingBottom: "28px",  // no longer need 80px offset
        overflowY: "auto", 
        position: "relative", 
        zIndex: 1 
      }}>
        {children}
      </main>
    </div>
    <div className="md:hidden">
      <BottomNav role={session.user.role} />
    </div>
  </div>
);
}
