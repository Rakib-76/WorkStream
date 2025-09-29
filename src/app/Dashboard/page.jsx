"use client";

import DashboardNavbar from "../Components/(dashboard_page)/Dashboard_nav/Dashboard_nav";
import Sidebar from "../Components/(dashboard_page)/Sidebar/Sidebar";
import DashboardContent from "../Components/(dashboard_page)/DashboardContent/DashboardContent";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  // Default to lowercase "overview"
  const [activeItem, setActiveItem] = useState("overview");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="flex-1 flex flex-col">
        <DashboardNavbar />

        <main className="flex-1 p-6 bg-gradient-to-br from-background to-muted/40 transition-colors">
          <DashboardContent activeItem={activeItem} />

        </main>
      </div>
    </div>
  );
}
