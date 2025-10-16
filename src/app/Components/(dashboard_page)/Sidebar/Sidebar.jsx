"use client";
import {
  CalendarCheck2,
  ChevronDown,
  Waves,
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
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { DataContext } from "../../../../context/DataContext";

export default function Sidebar({ activeItem, setActiveItem }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  //selectedProject project data from context
  const {selectedProject} = useContext(DataContext);

  // Handle responsive collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
      else setCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar Menu Items
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

  // Framer Motion Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: selectedProject ? 0.3 : 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? "80px" : "260px" }}
      transition={{ duration: 0.3 }}
      className="hidden md:flex relative pl-4 py-4 flex-col bg-[var(--sidebar-bg)] text-[var(--sidebar-foreground)]"
    >
      {/* Logo + Collapse Button */}
      <div className="z-10 flex justify-between mb-4">
        <Link href="/" className="group md:block lg:hidden">
          <div className="flex items-center space-x-3">
            <img
      src="https://i.ibb.co/gMhqDtMp/workstream-logo.png"
      alt="Uploaded Preview"
      className="h-10 object-contain rounded-xl"
    />
          </div>
        </Link>
        {/* <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition relative z-10"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button> */}
      </div>

      {/* 🧩 Project Name Display */}
      <div
        className={`mt-2 mb-6 transition-opacity duration-300 ${
          collapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"
        }`}
      >
        <h1 className="text-lg font-bold text-foreground truncate">
          Project : {selectedProject ? selectedProject.projectName : "No Project Selected"}
        </h1>
      </div>

      {/* Menu Items with Animation */}
      <motion.ul
        className="space-y-2 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {menuItems.map((item) => (
          <motion.div key={item.name} variants={itemVariants}>
            <li
              onClick={() =>
                item.children
                  ? setOpenDropdown(openDropdown === item.name ? null : item.name)
                  : setActiveItem(item.name)
              }
              className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-l-full transition relative
                ${
                  activeItem === item.name || openDropdown === item.name
                    ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] font-semibold shadow-md"
                    : "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
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

            {/* Dropdown Menu */}
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
                      className={`flex  items-center gap-3 cursor-pointer rounded-br-4xl rounded-tr-4xl mr-16 px-3 py-2 transition
                        ${
                          activeItem === child.name
                            ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)/40] text-[var(--primary-foreground)] font-semibold shadow-md"
                            : "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
                        }`}
                    >
                      {child.icon}
                      <span>{child.label}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.ul>
    </motion.aside>
  );
}
