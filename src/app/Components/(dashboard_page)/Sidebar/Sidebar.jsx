"use client";
import { CalendarCheck2, ChevronDown, Waves } from "lucide-react";
import { useState, useEffect } from "react";
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
import Link from "next/link";

export default function Sidebar({ activeItem, setActiveItem }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  // ✅ Detect screen size and set default collapsed state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true); // mobile/tablet collapsed
      } else {
        setCollapsed(false); // md+ expanded
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "overview", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { name: "tasks", label: "Tasks", icon: <CheckSquare size={20} /> },
    { name: "calendar", label: "Calendar", icon: <Calendar size={20} /> },
    { name: "attendence", label: "Attendence", icon: <CalendarCheck2 size={20} /> },
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
        { name: "reports", label: "Reports", icon: <Share2 size={18} /> },
      ],
    },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? "80px" : "260px" }}
      transition={{ duration: 0.3 }}
      className="hidden md:flex relative min-h-screen bg-gradient-to-b 
                 from-[var(--sidebar)]/70 to-[var(--card)]/60
                 dark:from-[var(--sidebar)]/80 dark:to-[var(--card)]/70
                 backdrop-blur-xl border-r border-[var(--sidebar-border)] 
                 p-4 flex-col overflow-hidden"
    >
      {/* Floating Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-teal-50 
                      dark:from-indigo-900 dark:via-gray-900 dark:to-teal-900" />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-200/30 dark:bg-indigo-700/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-200/30 dark:bg-teal-500/30 rounded-full blur-3xl" />

      {/* Collapse Button */}
      <div className="z-10 block flex  justify-between">
<Link href="/" className="group md:block lg:hidden">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-primary to-secondary rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md">
                    <Waves className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </Link>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="self-end mb-6 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition relative z-10"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      </div>
      

      {/* Menu Items */}
      <ul className="space-y-2 relative z-10">
        {menuItems.map((item) => (
          <div key={item.name}>
            <li
              onClick={() =>
                item.children
                  ? setOpenDropdown(openDropdown === item.name ? null : item.name)
                  : setActiveItem(item.name)
              }
              className={`flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 transition relative
                ${
                  activeItem === item.name || openDropdown === item.name
                    ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] font-semibold shadow-md"
                    : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
                }`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}

              {item.children && !collapsed && (
                <motion.span
                  animate={{ rotate: openDropdown === item.name ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-auto"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              )}
            </li>

            {/* Dropdown */}
            <AnimatePresence>
              {item.children && openDropdown === item.name && !collapsed && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-6 mt-2 space-y-1 relative"
                >
                  <span className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] rounded-full"></span>

                  {item.children.map((child) => (
                    <li
                      key={child.name}
                      onClick={() => setActiveItem(child.name)}
                      className={`flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 transition
                        ${
                          activeItem === child.name
                            ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] font-semibold shadow-md"
                            : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
                        }`}
                    >
                      {child.icon}
                      <span>{child.label}</span>
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
