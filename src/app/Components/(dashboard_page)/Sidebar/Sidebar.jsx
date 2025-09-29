"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  AppWindow,
  ListTodo,
  MessageCircle,
  PhoneCall,
  Users,
  StickyNote,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({ activeItem, setActiveItem }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const menuItems = [
    { name: "overview", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { name: "mytask", label: "My Task", icon: <CheckSquare size={20} /> },
    { name: "calendar", label: "Calendar", icon: <Calendar size={20} /> },
    {
      name: "applications",
      label: "Applications",
      icon: <AppWindow size={20} />,
      children: [
        { name: "todo", label: "To-do", icon: <ListTodo size={18} /> },
        { name: "chat", label: "Chat", icon: <MessageCircle size={18} /> },
        { name: "callmeet", label: "Call/Meet", icon: <PhoneCall size={18} /> },
        { name: "team", label: "Team", icon: <Users size={18} /> },
        { name: "notes", label: "Notes", icon: <StickyNote size={18} /> },
        { name: "ideas", label: "Sharing Ideas", icon: <Share2 size={18} /> },
      ],
    },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? "80px" : "260px" }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-[var(--sidebar)]/70 to-[var(--card)]/60
                 dark:from-[var(--sidebar)]/80 dark:to-[var(--card)]/70
                 backdrop-blur-xl border-r border-[var(--sidebar-border)] p-4 flex flex-col"
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="self-end mb-6 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Menu Items */}
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <div key={item.name}>
            <li
  onClick={() => {
    // Only update activeItem if the item has NO children
    if (item.children) {
      setOpenDropdown(openDropdown === item.name ? false : item.name);
    } else {
      setActiveItem(item.name);
    }
  }}
  className={`flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 transition relative
    ${
      activeItem === item.name
        ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] font-semibold shadow-lg"
        : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
    }`}
>
  {item.icon}
  {!collapsed && <span className="flex-1">{item.label}</span>}
  {item.children && !collapsed && (
    <motion.span
      animate={{ rotate: openDropdown === item.name ? 90 : 0 }}
      transition={{ duration: 0.2 }}
    >
      ▶
    </motion.span>
  )}
</li>


            {/* Dropdown children */}
            <AnimatePresence>
              {item.children && openDropdown === item.name && !collapsed && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-8 mt-1 space-y-1"
                >
                  {item.children.map((child) => (
                    <li
                      key={child.name}
                      onClick={() => setActiveItem(child.name)} // <--- update parent state
                      className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm transition
                        ${
                          activeItem === child.name
                            ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-medium"
                            : "text-gray-400 hover:text-gray-300 hover:bg-white/10"
                        }`}
                    >
                      {child.icon}
                      {child.label}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        ))}
      </ul>
    </motion.aside>
  );
}
