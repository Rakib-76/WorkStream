"use client";

import DashboardNavbar from "../Components/(dashboard_page)/Dashboard_nav/Dashboard_nav";
import Sidebar from "../Components/(dashboard_page)/Sidebar/Sidebar";
import DashboardContent from "../Components/(dashboard_page)/DashboardContent/DashboardContent";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MobileNavbar from "../Components/(dashboard_page)/MobileNavbar/MobileNavbar";

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
  {/* Sidebar only for md+ devices */}
  <div className="hidden md:block">
    <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
  </div>

  <div className="flex-1 flex flex-col">
    {/* Mobile Navbar only for small devices */}
    <MobileNavbar activeItem={activeItem} setActiveItem={setActiveItem} />

    <DashboardNavbar />

    <main 
      className="flex-1 p-6 transition-all duration-700 shadow-inner 
                 
                 /* Light Mode Gradient (Clean and Soft) */
                 bg-gradient-to-br from-gray-50 via-white to-sky-50
                 border-t border-gray-200/50 text-gray-800
                 
                 /* Dark Mode Gradient (Gorgous and Deep) */
                 dark:from-slate-900 dark:via-gray-950 dark:to-indigo-950 
                 dark:border-t dark:border-indigo-700/50 dark:text-gray-100" 
    >
      <DashboardContent activeItem={activeItem} />
    </main>
  </div>
</div>

  );
}
