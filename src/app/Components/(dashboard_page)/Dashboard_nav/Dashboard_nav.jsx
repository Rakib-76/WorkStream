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
import { useState, useRef, useEffect, useContext } from "react";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "../../../Provider/ThemeToggle";
import Button from "../../../Components/(dashboard_page)/UI/Button";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { MemberInput } from "../../../../lib/MemberInput";
import { Controller, useForm } from "react-hook-form";
import useAxiosSecure from "../../../../lib/useAxiosSecure";
import { DataContext } from "../../../../context/DataContext";
import NotificationBell from "../NotificationBell/NotificationBell";
import ProfileModal from "../../(home_page)/ProfileModal/ProfileModal";

export default function DashboardNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const projectsDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [userProjects, setUserProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const fileInputRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const { control, register, handleSubmit } = useForm();
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const userName = session?.user?.name || "Unknown User";
  const userEmail = session?.user?.email || "Unknown Email";
  const userImage = session?.user?.image || "/def-profile.jpeg";

  // It is used for search 

  const [searchText, setSearchText] = useState("");

  // data from Context
  const { setSelectedProject, selectedProject, userData } = useContext(DataContext);
  const selectedProjectId = selectedProject?._id;


  // Fetch user-specific projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!session?.user?.email) return;

      try {
        setLoading(true);
        const res = await axiosSecure.get(`/api/projects?email=${session?.user?.email}`);
        if (res?.data?.success) {
          const sortedProjects = res?.data?.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setUserProjects(sortedProjects);
          // Set initial selected project from local storage if not already set
          if (!selectedProject) {
            const savedProject = JSON.parse(localStorage.getItem("selectedProject"));
            if (savedProject && res?.data?.data.some(p => p._id === savedProject._id)) {
              setSelectedProject(savedProject);
            }
          }
        }
      }
      catch (err) {
        console.error("Error fetching user projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, [session?.user?.email, axiosSecure, selectedProject, setSelectedProject]);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close Projects Dropdown
      if (projectsDropdownRef.current && !projectsDropdownRef.current.contains(e.target)) {
        setProjectsDropdownOpen(false);
      }
      // Keep search dropdown open only when mouse is over search area AND there is search text
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target) && searchText === "") {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchText]);

  // Image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(URL.createObjectURL(file));
  };

  // Logout handler
  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to log out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await signOut({ redirect: false });
        localStorage.removeItem("selectedProject");
        Swal.fire({
          icon: "success",
          title: "Logged out!",
          text: "You have successfully logged out.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => (window.location.href = "/"));
      }
    });
  };


  // Fetch creator info
  useEffect(() => {
    const fetchCreatorInfo = async () => {
      if (!session?.user?.email) return;
      try {
        const { data: creatorInfo } = await axiosSecure.get(`/api/users?email=${session?.user?.email}`);
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
  }, [session?.user?.email, axiosSecure]);

  // Handle project selection from search or dropdown
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setProjectsDropdownOpen(false);
    setIsSearchOpen(false);
    setSearchText(""); // Clear search text after selection
  };

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

      if (response?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Project Created!",
          text: "Your project has been saved successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsModalOpen(false);
        // Optionally refetch projects after creation
        // fetchUserProjects(); 
      } else {
        Swal.fire("Error", response?.data?.error || "Failed to create project", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // Project Filtering Logic
  const filteredProjects = userProjects.filter((project) =>
    project.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
    (project.projectTags && project.projectTags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase())))
  );

  const handleProfileBtn = () => {
    const modal = document.getElementById("profile_modal");
    if (modal) modal.showModal();
  }


  return (
    <>
      {/* Navbar */}
      <header className=" hidden md:block lg:block ">
        <div className="sticky top-0 z-50 w-full bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-md" >
          {/* Left: Logo */}
          <Link href="/" className="group lg:block md:hidden">
            <div className="flex gap-2 items-center"> <div className="flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-md bg-white">
              <img
                src="https://i.ibb.co/gMhqDtMp/workstream-logo.png"
                alt="Uploaded Preview"
                className="h-full object-contain rounded-xl"
              />
            </div><span className="font-bold text-2xl ">WorkStream</span></div>
          </Link>

          {/* Middle Section */}
          <div className="flex-1 flex justify-center items-center gap-3 max-w-lg">

            {/* Search Container with Relative Position */}
            <div className="relative w-full max-w-sm" ref={searchContainerRef}>
              <div
                // className={`flex items-center rounded-full px-3 py-1 bg-muted transition-all duration-500 ease-in-out border ${isSearchOpen
                //   ? "w-64 border-primary/60 bg-background"
                //   : "w-10 justify-center border-transparent"
                //   }`}
                className="flex items-center rounded-full px-3 py-1 bg-muted transition-all duration-500 ease-in-out border w-70 border-primary/60"
                onMouseEnter={() => setIsSearchOpen(true)}
                onMouseLeave={() => setIsSearchOpen(false)}
              >
                <Search className="w-5 h-5 text-muted-foreground transition-colors duration-300" />
                {isSearchOpen && (
                  <input
                    type="text"
                    placeholder="Search by Project name or Tags"
                    className="ml-2 bg-transparent focus:outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                )}
              </div>

              {/* Search Results Dropdown (Absolute Position) - Show when text is present, regardless of mouse state */}
              <AnimatePresence>
                {searchText && ( // Only show when search text is present
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-64 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-100 dark:border-gray-700 z-50"
                  >
                    {filteredProjects.length > 0 ? (
                      <div className="p-2 space-y-1">
                        {filteredProjects.map((project) => (
                          <button
                            key={project._id}
                            onClick={() => handleProjectSelect(project)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex justify-between items-center ${selectedProject?._id === project._id
                              ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                              }`}
                          >
                            <span className="font-medium text-gray-800 dark:text-gray-100 truncate">
                              {project.projectName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                              {project.companyName}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                        No projects found matching "{searchText}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Create Button */}
            <Button
              size="sm"
              className="hidden gap-2 items-center bg-primary text-primary-foreground"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4" />
              Create
            </Button>

            {/* Projects Dropdown */}
            <div className="relative" ref={projectsDropdownRef}>
              <button
                onClick={() => setProjectsDropdownOpen(!projectsDropdownOpen)}
                className=" hidden md:inline-flex bg-accent text-black hover:bg-accent/90 lg:inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none h-8 px-4 py-1"
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
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden z-50 border border-gray-100 dark:border-gray-700"
                  >
                    {/* Header */}
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Your Projects ({userProjects.length})
                      </h4>
                      <button
                        onClick={() => setProjectsDropdownOpen(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Content: Use unfiltered list here for the main project picker */}
                    <div className="max-h-80 overflow-y-auto p-3 space-y-3">
                      {loading ? (
                        <div className="flex justify-center items-center py-6">
                          <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-primary dark:border-default-600"></div>
                        </div>
                      ) : userProjects.length === 0 ? (
                        <div className="text-center text-sm text-gray-500 py-4">
                          No projects found
                        </div>
                      ) : (
                        userProjects.map((project) => (
                          <motion.div
                            key={project._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <button
                              onClick={() => handleProjectSelect(project)}
                              className={`w-full text-left p-3 rounded-xl border transition-all ${selectedProject?._id === project._id
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                }`}
                            >
                              {/* Project Header */}
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                                  {project.projectName}
                                </h3>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${project.priority === "High"
                                    ? "bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300"
                                    : project.priority === "Medium"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300"
                                      : "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300"
                                    }`}
                                >
                                  {project.priority}
                                </span>
                              </div>

                              {/* Company + Manager */}
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                🏢 {project.companyName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                👤 Manager: {project.manager?.name || "N/A"}
                              </p>

                              {/* Status & Dates */}
                              <div className="flex justify-between items-center mt-2">
                                <span
                                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${project.status === "Active"
                                    ? "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                  {project.status}
                                </span>
                                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                                  📅 {new Date(project.startDate).getFullYear()} -{" "}
                                  {new Date(project.endDate).getFullYear()}
                                </span>
                              </div>
                            </button>
                          </motion.div>
                        ))
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>

                    {/* Unselect Button */}
                    <div className="p-3">
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

          {/* Right Section (Omitted for brevity) */}
          <div className="flex items-center gap-3 relative">
            <NotificationBell className="w-5 h-5" selectedProjectId={selectedProject?._id} userEmail={userEmail} />
            <ThemeToggle />

            {/* Profile Avatar */}
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Image
                  src={session?.user?.image || "/def-profile.png"}
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
                        src={session?.user?.image || "/def-profile.png"}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {userData ?.name || "Unknown User"}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {session?.user?.email || "No email"}
                      </p>
                    </div>
                  </div>

                  <ul className="p-2 text-gray-700 dark:text-gray-200">
                    <li
                      onClick={() => handleProfileBtn()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                      <User size={18} /> Profile
                    </li>
                    <li
                      onClick={() => (window.location.href = "/Dashboard/profileSetting")}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                      <Settings size={18} /> Account settings
                    </li>
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
        </div>
      </header>


      {/* Create Project Modal (Omitted for brevity) */}
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
      <ProfileModal />
    </>
  );
}