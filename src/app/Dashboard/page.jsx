"use client";

import DashboardNavbar from "../Components/(dashboard_page)/Dashboard_nav/Dashboard_nav";
import Sidebar from "../Components/(dashboard_page)/Sidebar/Sidebar";
import DashboardContent from "../Components/(dashboard_page)/DashboardContent/DashboardContent";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  // Default to lowercase "overview"
  const [activeItem, setActiveItem] = useState("overview");

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
