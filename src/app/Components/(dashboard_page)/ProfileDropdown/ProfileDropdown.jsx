"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown, LogOut, User, Settings, SwitchCamera } from "lucide-react";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src="/avatar.png"
          alt="Profile"
          width={36}
          height={36}
          className="object-cover"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Ashfaq Sarker Abid
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                abidsarker213@gmail.com
              </p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary">
              <Image
                src="/avatar.png"
                alt="Profile"
                width={40}
                height={40}
                className="object-cover"
              />
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
  );
}
