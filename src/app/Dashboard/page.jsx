"use client";

import DashboardNavbar from "../Components/(dashboard_page)/Dashboard_nav/Dashboard_nav";
import Sidebar from "../Components/(dashboard_page)/Sidebar/Sidebar";
import DashboardContent from "../Components/(dashboard_page)/DashboardContent/DashboardContent";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MobileNavbar from "../Components/(dashboard_page)/MobileNavbar/MobileNavbar";

export default function DashboardLayout({ children }) {
  const [activeItem, setActiveItem] = useState("overview");
  const { data: session, status } = useSession();
  const router = useRouter();



  // Redirect if not logged in
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
  {/* Sidebar (visible only on md and up) */}
  <div
    className="hidden lg:flex fixed top-0 left-0 h-screen w-[260px]
       bg-gradient-to-b from-[var(--sidebar)]/70 to-[var(--card)]/60
       dark:from-[var(--sidebar)]/80 dark:to-[var(--card)]/70
       backdrop-blur-xl border-r border-[var(--sidebar-border)]
       flex-col overflow-hidden z-40"
  >
    <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
    {/* Background gradient same as before */}
    {/* Background gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br 
                        from-indigo-50 via-white to-teal-50 
                        dark:from-indigo-900 dark:via-gray-900 dark:to-teal-900"
          />
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <div
              className="absolute -top-24 -left-24 w-72 h-72 
                          bg-indigo-200/30 dark:bg-indigo-700/30 
                          rounded-full blur-3xl"
            />
            <div
              className="absolute bottom-0 right-0 w-72 h-72 
                          bg-teal-200/30 dark:bg-teal-500/30 
                          rounded-full blur-3xl"
            />
          </div>
        </div>
  </div>

  {/* ✅ Main content with margin-left so it doesn’t hide under sidebar */}
  <div className="flex-1 flex  flex-col lg:ml-[260px]">
    {/* Mobile Navbar */}
    <MobileNavbar activeItem={activeItem} setActiveItem={setActiveItem} />

    {/* Dashboard Navbar */}
    <DashboardNavbar />

    {/* Main content area */}
    <main
      className="flex-1 p-6 transition-all duration-700 shadow-inner 
                 bg-gradient-to-br from-blue-100 via-sky-100 to-sky-50
                 border-t border-gray-200/50 text-gray-800
                 dark:from-slate-900 dark:via-gray-950 dark:to-indigo-950 
                 dark:border-t dark:border-indigo-700/50 dark:text-gray-100
                 overflow-y-auto"
    >
      <DashboardContent activeItem={activeItem} />
    </main>
  </div>
</div>

  );
}
