"use client";
import {
  Upload,
  Smile,
  Waves,
  Bell,
  Settings,
  Search,
  PlusCircle,
  FolderKanban,
  User,
  LogOut,
  SwitchCamera,
  UserPlus,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "../../../Provider/ThemeToggle";
import Button from "../../../Components/(dashboard_page)/UI/Button";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { MemberInput } from "./MemberInput";
import { Controller, useForm } from "react-hook-form";
import useAxiosSecure from "../../../../lib/useAxiosSecure";

export default function DashboardNavbar({ setSelectedProject }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const projectsDropdownRef = useRef(null);
  const [userProjects, setUserProjects] = useState([]);

  const { data: session } = useSession();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const fileInputRef = useRef(null);
  
  const axiosSecure = useAxiosSecure();
  const { control, register, handleSubmit } = useForm();
  const [manager, setManager] = useState(null);

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
        console.error("Error fetching user projects:", err);
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

  // Logout handler
  const handleLogout = async () => {
    await signOut({ redirect: false });
    Swal.fire({
      icon: "success",
      title: "Logged out!",
      text: "You have successfully logged out.",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => (window.location.href = "/"));
  };

  // Fetch creator info
  useEffect(() => {
    const fetchCreatorInfo = async () => {
      if (!session?.user?.email) return;
      try {
        const { data: creatorInfo } = await axiosSecure.get(`/api/users?email=${session.user.email}`);
        const managerData = {
          id: creatorInfo?._id,
          name: creatorInfo?.name || session?.user?.name,
          email: creatorInfo?.email || session?.user?.email,
        };
        setManager(managerData);
      } catch (error) {
        console.error("Error fetching creator info:", error);
      }
    };
    fetchCreatorInfo();
  }, [session?.user?.email]);

  // Create project
  const onSubmit = async (data) => {
    try {
      const payload = {
        projectName: data.projectName,
        companyName: data.companyName || "",
        description: data.description,
        priority: data.priority || "Medium",
        teamRole: data.teamRole || "Member",
        status: data.status || "Active",
        startDate: data.startDate,
        endDate: data.endDate,
        manager: manager,
        teamMembers: data.members || [],
        milestones: [],
        tasks: {
          total: 0,
          completed: 0,
          pending: 0,
        },
        files: [],
        lastUpdated: new Date().toISOString(),
        logo: selectedImage || null,
        emoji: selectedEmoji || null,
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
          text: "Your project has been saved successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsModalOpen(false);
      } else {
        Swal.fire("Error", response.data.error || "Failed to create project", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <>
      {/* Navbar */}
      <header className="w-full bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-md">
        {/* Left: Logo */}
        <Link href="/" className="group lg:block md:hidden">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-primary to-secondary rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md">
              <Waves className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              WorkStream
            </span>
          </div>
        </Link>

        {/* Middle Section */}
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

          {/* Create Button */}
          <Button
            size="sm"
            className="hidden sm:flex gap-2 items-center bg-primary text-primary-foreground"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Create
          </Button>

          {/* Projects Dropdown */}
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
                      {userProjects.map((project) => (
                        <li key={project._id}>
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

        {/* Right Section */}
        <div className="flex items-center gap-3 relative">
          <Button size="icon" variant="ghost">
            <Bell className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <Settings className="w-5 h-5" />
          </Button>
          <ThemeToggle />

          {/* Profile Avatar */}
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Image
                src={session?.user?.image || "/avatar.png"}
                alt="Profile"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                <div className="flex items-center bg-gray-300 dark:bg-black gap-3 p-4 border-b border-gray-300 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-primary">
                    <Image
                      src={session?.user?.image || "/avatar.png"}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {session?.user?.name || "Unknown User"}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {session?.user?.email || "No email"}
                    </p>
                  </div>
                </div>

                <ul className="p-2 text-gray-700 dark:text-gray-200">
                  <li className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    <User size={18} /> Profile
                  </li>
                  <li className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    <Settings size={18} /> Account settings
                  </li>
                  <li
                    onClick={() => setShowMemberSearch(!showMemberSearch)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <UserPlus size={18} /> Add member
                  </li>
                  {showMemberSearch && (
                    <div className="px-4 py-2 transition-all duration-300">
                      <input
                        type="text"
                        placeholder="Search member..."
                        className="w-full rounded-md px-3 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}
                  <li className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    <SwitchCamera size={18} /> Switch account
                  </li>
                  <li
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-red-600"
                  >
                    <LogOut size={18} /> Log out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full sm:max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
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
                    className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    {...register("companyName")}
                    type="text"
                    className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    {...register("description")}
                    rows="3"
                    className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none resize-none"
                    placeholder="Write project details..."
                  />
                </div>
              </div>

              {/* Middle Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Team Role</label>
                  <select
                    {...register("teamRole")}
                    className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                  >
                    <option>Member</option>
                    <option>Leader</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Add Members</label>
                  <Controller
                    name="members"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => <MemberInput value={field.value} onChange={field.onChange} />}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date Range</label>
                  <div className="items-center gap-2">
                    <input
                      {...register("startDate")}
                      type="date"
                      className="flex-1 rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                    />
                    <span className="hidden sm:block">to</span>
                    <input
                      {...register("endDate")}
                      type="date"
                      className="flex-1 rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5 relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-3 border rounded-xl text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <Upload size={16} /> Upload Logo
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="px-4 py-3 border rounded-xl text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <Smile size={16} /> Emoji
                  </button>
                </div>

                <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-48 text-center text-gray-500 dark:text-gray-400 relative">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Uploaded Preview"
                      className="h-full object-contain rounded-xl"
                    />
                  ) : selectedEmoji ? (
                    <span className="text-6xl">{selectedEmoji}</span>
                  ) : (
                    "Preview"
                  )}
                </div>

                {showEmojiPicker && (
                  <div className="absolute bottom-[-250px] right-0 z-50">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setSelectedEmoji(e.emoji);
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}

                <div className="flex justify-end pt-5">
                  <Button type="submit" size="sm" className="px-6 py-3">
                    Create Project
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
