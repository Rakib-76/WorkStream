"use client";
import { Waves } from "lucide-react";
import { useState } from "react";
import { Bell, Settings, Search, PlusCircle, FolderKanban } from "lucide-react";
import { ThemeToggle } from "../../../Provider/ThemeToggle";
import  Button  from "../../../Components/(dashboard_page)/UI/Button";
import Image from "next/image";
import Link from "next/link";

export default function DashboardNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="w-full bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-md">
      {/* Left: Logo */}
      <Link href="/" className="group">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-primary to-secondary rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md">
                  <Waves className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  WorkStream
                </span>
              </div>
            </Link>

      {/* Middle: Search + Buttons */}
      <div className="flex-1 flex justify-center items-center gap-3 max-w-lg">
        {/* Search */}
        <div
  className={`flex items-center rounded-full px-3 py-1 bg-muted transition-all duration-500 ease-in-out border ${
    isSearchOpen
      ? "w-64 border-primary/60 bg-background"
      : "w-10 justify-center border-transparent"
  }`}
  onMouseEnter={() => setIsSearchOpen(true)}
  onMouseLeave={() => setIsSearchOpen(false)}
>
  <Search className="w-5 h-5 text-muted-foreground transition-colors duration-300" />
  {isSearchOpen && (
    <input
      type="text"
      placeholder="Search..."
      className="ml-2 bg-transparent focus:outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
    />
  )}
</div>



        {/* Buttons */}
        <Button
          size="sm"
          className="hidden sm:flex gap-2 items-center bg-primary text-primary-foreground"
        >
          <PlusCircle className="w-4 h-4" />
          Create
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="hidden sm:flex gap-2 items-center"
        >
          <FolderKanban className="w-4 h-4" />
          Projects
        </Button>
      </div>

      {/* Right: Icons + Profile */}
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full  border-2 border-transparent hover:border-border transition-all duration-300"
        >
          <Bell className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full border-2 border-transparent hover:border-border transition-all duration-300"
        >
          <Settings className="w-5 h-5" />
        </Button>
        <ThemeToggle />
        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary">
          <Image
            src="/avatar.png" 
            alt="Profile"
            width={36}
            height={36}
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}
