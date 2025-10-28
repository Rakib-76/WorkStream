"use client";

import { useState, useRef, useEffect, useContext } from "react";
import {
  Menu,
  PlusCircle,
  Waves,
  X,
  Upload,
  Smile,
  FolderKanban,
} from "lucide-react";
import { ThemeToggle } from "../../../Provider/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Button from "../../../Components/(dashboard_page)/UI/Button";
import EmojiPicker from "emoji-picker-react";
import { useForm, Controller } from "react-hook-form";
import { MemberInput } from "../../../../lib/MemberInput";
import useAxiosSecure from "../../../../lib/useAxiosSecure";
import { DataContext } from "../../../../context/DataContext";

export default function MobileNavbar({ activeItem, setActiveItem }) {
  
const {selectedProject,setSelectedProject } = useContext(DataContext);
const [collapsed, setCollapsed] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const projectsDropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const { data: session } = useSession();
  const axiosSecure = useAxiosSecure();
  const { control, register, handleSubmit, reset } = useForm();


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

  // Fetch user-specific projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await axiosSecure.get(`/api/projects?email=${session?.user?.email}`);
        if (res.data.success) {
          const sortedProjects = res.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setUserProjects(sortedProjects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchUserProjects();
  }, [session?.user?.email, axiosSecure]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (projectsDropdownRef.current && !projectsDropdownRef.current.contains(e.target)) {
        setProjectsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(URL.createObjectURL(file));
  };

  // Logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    Swal.fire({
      icon: "success",
      title: "Logged out!",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => (window.location.href = "/"));
  };

  // Create project
  const onSubmit = async (data) => {
    try {
      const payload = {
        projectName: data.projectName,
        companyName: data.companyName || "",
        description: data.description || "",
        teamRole: data.teamRole || "Member",
        startDate: data.startDate,
        endDate: data.endDate,
        teamMembers: data.members || [],
        emoji: selectedEmoji || null,
        logo: selectedImage || null,
        createdBy: session?.user?.email,
        createdAt: new Date().toISOString(),
      };

      const response = await axiosSecure.post("/api/createProject", {
        collectionName: "projects",
        projectData: payload,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Project Created!",
          timer: 2000,
          showConfirmButton: false,
        });
        setUserProjects((prev) => [...prev, payload]);
        setIsModalOpen(false);
        reset();
        setSelectedImage(null);
        setSelectedEmoji(null);
      } else {
        Swal.fire("Error", response.data.error || "Failed to create project", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const menuItems = [
    { name: "overview", label: "Overview" },
    { name: "tasks", label: "Tasks" },
    { name: "calendar", label: "Calendar" },
    { name: "attendence", label: "Attendence" },
    { name: "todo", label: "To-do" },
    { name: "chat", label: "Chat" },
    { name: "callmeet", label: "Call/Meet" },
    { name: "team", label: "Team" },
    { name: "notes", label: "Notes" },
    { name: "reports", label: "Reports" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border flex items-center justify-between px-4 py-3 z-50">
        {/* <Link href="/" className="group">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-md">
              <Waves className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </Link> */}
        <img
      src="https://i.ibb.co/gMhqDtMp/workstream-logo.png"
      alt="Uploaded Preview"
      className="h-10 object-contain rounded-xl"
    />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-muted transition"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Drawer Menu */}
      <div
        className={`absolute lg:hidden top-[66px] left-0 w-full bg-background shadow-lg  transition-all duration-500 ease-in-out overflow-hidden z-[9999] ${
  isOpen ? "max-h-[calc(100vh-52px)]" : "max-h-0"
}`}

      >
        <div className="h-[calc(100vh-52px)] overflow-y-auto">
          {/* Profile */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Image
                src={session?.user?.image || "/avatar.png"}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="font-medium">{session?.user?.name || "User"}</span>
            </div>
            <ThemeToggle />
          </div>

          {/* Create + Projects */}
          <div className="p-4 border-b border-border flex gap-3 relative">
            <Button
              size="sm"
              className="flex gap-2 items-center bg-primary text-primary-foreground"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4" />
              Create
            </Button>

            {/* Project Dropdown */}
            <div className="relative" ref={projectsDropdownRef}>
              <button
                onClick={() => setProjectsDropdownOpen(!projectsDropdownOpen)}
                className="bg-accent text-black hover:bg-accent/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none h-8 px-4 py-1"
              >
                <FolderKanban className="w-4 h-4" />
                Projects
              </button>

              <AnimatePresence>
                {projectsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 mt-2  bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden z-50"
                  >
                    {/* Header */}
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Your Projects
                      </h4>
                      <button
                        onClick={() => setProjectsDropdownOpen(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-64 overflow-y-auto p-3 space-y-2">
                      {userProjects.length === 0 ? (
                        <div className="text-sm text-gray-500 py-4 text-center">
                          No projects found
                        </div>
                      ) : (
                        userProjects.map((project) => (
                          <button
                            key={project._id}
                            onClick={() => {
                              setSelectedProject(project);
                              setProjectsDropdownOpen(false);
                            }}
                            className={`w-full text-left p-3 rounded-xl border transition-all ${
                              selectedProject?._id === project._id
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                {project.projectName}
                              </h3>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  project.priority === "High"
                                    ? "bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300"
                                    : project.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300"
                                    : "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300"
                                }`}
                              >
                                {project.priority}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Manager: {project.manager?.name || "N/A"}
                            </p>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Unselect */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          setSelectedProject(null);
                          setProjectsDropdownOpen(false);
                        }}
                        className="w-full text-center px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-all"
                      >
                        Unselect Project
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Project name display */}
          <div
        className={`mt-2 mb-2 ml-4 transition-opacity duration-300 ${
          collapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"
        }`}
      >
      
        <h1 className="text-lg font-bold text-foreground truncate">
          Project: {selectedProject ? selectedProject.projectName : "No Project Selected"}
        </h1>
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

            {/* Logout */}
            <li
              onClick={handleLogout}
              className="px-3 py-2 text-red-500 hover:bg-muted rounded-lg cursor-pointer mt-3"
            >
              Logout
            </li>
          </ul>
        </div>
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full sm:max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Project
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="lg:p-6 p-2 w-full grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Name *</label>
                  <input
                    {...register("projectName")}
                    type="text"
                    required
                    className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    {...register("companyName")}
                    type="text"
                    className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    {...register("description")}
                    rows="3"
                    className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none resize-none"
                  />
                </div>
              </div>

              {/* Middle Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Team Role</label>
                  <select
                    {...register("teamRole")}
                    className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option>Member</option>
                    <option>Leader</option>
                  </select>
                </div>
                <Controller
                  name="members"
                  control={control}
                  render={({ field }) => <MemberInput {...field} />}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 border rounded-xl"
                  >
                    <Smile />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute z-50">
                      <EmojiPicker
                        onEmojiClick={(emoji) => {
                          setSelectedEmoji(emoji.emoji);
                          setSelectedImage(null);
                          setShowEmojiPicker(false);
                        }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 border rounded-xl"
                  >
                    <Upload />
                  </button>
                </div>
                {(selectedImage || selectedEmoji) && (
                  <div className="mt-2 text-lg">
                    {selectedImage ? (
                      <Image src={selectedImage} alt="logo" width={60} height={60} />
                    ) : (
                      selectedEmoji
                    )}
                  </div>
                )}
              </div>

              {/* Bottom */}
              <div className="lg:col-span-3 flex justify-end gap-3 mt-4">
                <Button type="submit" className="bg-primary text-white flex gap-2 items-center">
                  <PlusCircle className="w-4 h-4" /> Create
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-muted text-black flex gap-2 items-center"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
