"use client";

export default function DashboardNavbar() {
  return (
    <header className="w-full bg-card border-b border-border p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold text-primary">🚀 Project Manager</h1>
      <button
        onClick={() => document.documentElement.classList.toggle("dark")}
        className="px-3 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        Toggle Theme
      </button>
    </header>
  );
}
