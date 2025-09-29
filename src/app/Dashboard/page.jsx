"use client";

import DashboardNavbar from "../Components/(dashboard_page)/Dashboard_nav/Dashboard_nav";
import Sidebar from "../Components/(dashboard_page)/Sidebar/Sidebar";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [activeItem, setActiveItem] = useState("Overview");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardNavbar />

        <main className="flex-1 p-6 bg-gradient-to-br from-background to-muted/40 transition-colors">
          {children || (
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <h1 className="text-2xl font-bold mb-4">{activeItem}</h1>
              <p className="text-muted-foreground">
                This is the <span className="font-medium">{activeItem}</span> section.
                Replace with your own project data.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
