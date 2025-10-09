"use client";

import { useState, useRef, useEffect } from "react";
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
import { MemberInput } from "../Dashboard_nav/MemberInput";
import useAxiosSecure from "../../../../lib/useAxiosSecure";

export default function MobileNavbar({ activeItem, setActiveItem, setSelectedProject }) {
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

  // Fetch user-specific projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await axiosSecure.get(`/api/projects?email=${session.user.email}`);
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
    { name: "mytask", label: "My Task" },
    { name: "calendar", label: "Calendar" },
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
      <header className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border flex items-center justify-between px-4 py-3 z-50">
        <Link href="/" className="group">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-md">
              <Waves className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-muted transition"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Drawer Menu */}
      <div
        className={`absolute md:hidden top-[52px] left-0 w-full bg-background shadow-lg border-t border-border transition-all duration-500 ease-in-out overflow-hidden ${
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
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden z-50"
>

      {userProjects.length === 0 ? (
        <div className="p-3 text-sm text-gray-500">No projects found</div>
      ) : (
        <ul>
          {userProjects.map((project, i) => (
            <li key={i}>
              <button
                onClick={() => {
                  setSelectedProject(project);
                  setProjectsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                {project.projectName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )}
</AnimatePresence>

            </div>
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
                  <div className="mt-2 text-lg">{selectedImage ? <Image src={selectedImage} alt="logo" width={60} height={60} /> : selectedEmoji}</div>
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
