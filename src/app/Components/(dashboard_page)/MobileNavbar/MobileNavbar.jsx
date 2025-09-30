"use client";

import { useState } from "react";
import { Menu, Waves, X } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "../../../Provider/ThemeToggle";
import Link from "next/link";

export default function MobileNavbar({ activeItem, setActiveItem }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "overview", label: "Overview" },
    { name: "mytask", label: "My Task" },
    { name: "calendar", label: "Calendar" },
    { name: "todo", label: "To-do" },
    { name: "chat", label: "Chat" },
    { name: "callmeet", label: "Call/Meet" },
    { name: "team", label: "Team" },
    { name: "notes", label: "Notes" },
    { name: "ideas", label: "Sharing Ideas" },
  ];

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border flex items-center justify-between px-4 py-3 z-50">
      {/* Logo */}
      <Link href="/" className="group">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-primary to-secondary rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md">
            <Waves className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </Link>

      {/* Hamburger Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-muted transition"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Drawer Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-background shadow-lg border-t border-border overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="h-full overflow-y-auto">
          {/* Profile + ThemeToggle */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Image
                src="/avatar.png"
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="font-medium">User Name</span>
            </div>
            <ThemeToggle />
          </div>

          {/* Create Project & Projects */}
          <div className="p-4 border-b border-border flex gap-3">
            <button className="bg-primary text-white px-4 py-2 rounded-lg flex-1 hover:opacity-90 transition">
              Create Project
            </button>
            <button className="border px-4 py-2 rounded-lg flex-1 hover:bg-muted transition">
              Projects
            </button>
          </div>

          {/* Menu Items */}
          <ul className="p-4 space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.name}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 rounded-lg cursor-pointer transition ${
                  activeItem === item.name
                    ? "bg-primary text-white font-semibold"
                    : "hover:bg-muted"
                }`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
