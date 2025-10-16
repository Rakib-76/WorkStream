"use client";

import DashboardNavbar from "../Components/(dashboard_page)/Dashboard_nav/Dashboard_nav";
import Sidebar from "../Components/(dashboard_page)/Sidebar/Sidebar";
import DashboardContent from "../Components/(dashboard_page)/DashboardContent/DashboardContent";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MobileNavbar from "../Components/(dashboard_page)/MobileNavbar/MobileNavbar";

export default function DashboardLayout() {
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
      {/* 🧭 Sidebar */}
      <div
        className="hidden md:flex fixed top-0 left-0 h-screen w-[260px]
        bg-gradient-to-b from-[var(--sidebar)]/70 to-[var(--card)]/60
        dark:from-[var(--sidebar)]/80 dark:to-[var(--card)]/70
        backdrop-blur-xl border-r border-[var(--sidebar-border)]
        flex-col overflow-hidden z-50"
      >
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br 
            from-indigo-50 via-white to-teal-50 
            dark:from-indigo-900 dark:via-gray-900 dark:to-teal-900" />
          <div className="absolute -top-24 -left-24 w-72 h-72 
            bg-indigo-200/30 dark:bg-indigo-700/30 
            rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 
            bg-teal-200/30 dark:bg-teal-500/30 
            rounded-full blur-3xl" />
        </div>
      </div>

      {/* 🧾 Main Content */}
      <div className="flex-1 flex flex-col md:ml-[260px] relative">
        {/* ✅ Mobile Navbar — fixed top */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
          <MobileNavbar activeItem={activeItem} setActiveItem={setActiveItem} />
        </div>

        {/* ✅ Dashboard Navbar — fixed top (below mobile) */}
        <div className="hidden md:block fixed top-0 left-[260px] right-0 z-40 bg-background/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
          <DashboardNavbar />
        </div>

        {/* ✅ Scrollable main content (padding added to avoid overlap) */}
        <main
          className="pt-[70px] md:pt-[80px] px-6 pb-10 transition-all duration-700 shadow-inner 
          bg-gradient-to-br from-blue-100 via-sky-100 to-sky-50
          border-t border-gray-200/50 text-gray-800
          dark:from-slate-900 dark:via-gray-950 dark:to-indigo-950 
          dark:border-t dark:border-indigo-700/50 dark:text-gray-100"
        >
          <DashboardContent activeItem={activeItem} />
        </main>
      </div>
    </div>
  );
}
