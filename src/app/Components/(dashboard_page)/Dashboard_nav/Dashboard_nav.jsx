"use client";
import { Waves, Bell, Settings, Search, PlusCircle, FolderKanban, User, LogOut, SwitchCamera } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "../../../Provider/ThemeToggle";
import Button from "../../../Components/(dashboard_page)/UI/Button";
import Image from "next/image";
import Link from "next/link";

export default function DashboardNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      <div className="flex items-center gap-3 relative">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full border-2 border-transparent hover:border-border transition-all duration-300"
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

        {/* Profile Avatar with Dropdown */}
        <div className="relative">
          <div
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Image
              src="/avatar.png"
              alt="Profile"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center  bg-gray-300 dark:bg-black gap-3 p-4 border-b border-gray-300 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-primary">
                  <Image
                    src="/avatar.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 ">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Ashfaq Sarker Abid
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    abidsarker213@gmail.com
                  </p>
                </div>
                
              </div>

              {/* Menu Items */}
              <ul className="p-2 text-gray-700 dark:text-gray-200">
                <li className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <User size={18} /> Profile
                </li>
                <li className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <Settings size={18} /> Account settings
                </li>
                <li className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  <SwitchCamera size={18} /> Switch account
                </li>
                <li className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-red-600">
                  <LogOut size={18} /> Log out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
