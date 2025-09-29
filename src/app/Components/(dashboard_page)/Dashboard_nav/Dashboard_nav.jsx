"use client";
import {
  Upload,
  Smile,
  Calendar,
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
import { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

import { ThemeToggle } from "../../../Provider/ThemeToggle";
import Button from "../../../Components/(dashboard_page)/UI/Button";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { MemberInput } from "./MemberInput";



export default function DashboardNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const fileInputRef = useRef(null);

  // Image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    Swal.fire({
      icon: "success",
      title: "Logged out!",
      text: "You have successfully logged out.",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "/";
    });
  };

  return (
    <>
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


        {/* Middle: Search  */}
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
            onClick={() => setIsModalOpen(true)}
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
                src={session?.user?.image || "/avatar.png"}
                alt="Profile"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                {/* Header */}
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

                {/* Menu Items */}
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

      {/* Create Modal */}
      {/* Create Modal */}
{isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 animate-fadeIn">
      {/* Header */}
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

      {/* Body */}
      <div className="p-6 w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {/* Left Column */}
  <div className="space-y-5">
    {/* Project Name */}
    <div className="transition-all duration-300">
      <label className="block text-sm font-medium mb-1">Project Name *</label>
      <input
        type="text"
        className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary transition duration-300 ease-in-out hover:shadow-lg hover:border-primary outline-none"
        placeholder="Enter project name"
      />
    </div>

    {/* Company Name */}
    <div className="transition-all duration-300">
      <label className="block text-sm font-medium mb-1">Company Name</label>
      <input
        type="text"
        className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary transition duration-300 ease-in-out hover:shadow-lg hover:border-primary outline-none"
        placeholder="Enter company name"
      />
    </div>

    {/* Description */}
    <div className="transition-all duration-300">
      <label className="block text-sm font-medium mb-1">Description</label>
      <textarea
        rows="3"
        className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary transition duration-300 ease-in-out hover:shadow-lg hover:border-primary outline-none resize-none"
        placeholder="Write project details..."
      />
    </div>
  </div>

  {/* Middle Column */}
  <div className="space-y-5">
    {/* Team Role */}
    <div className="transition-all duration-300">
      <label className="block text-sm font-medium mb-1">Team Role</label>
      <select
        className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary transition duration-300 ease-in-out hover:shadow-lg hover:border-primary outline-none cursor-pointer"
      >
        <option>Leader</option>
        <option>Member</option>
      </select>
    </div>

    {/* Add Members */}
    <div className="transition-all duration-300">
      <label className="block text-sm font-medium mb-1">Add Members</label>
      <MemberInput />
    </div>

    {/* Date Range */}
    <div className="transition-all duration-300">
      <label className="block text-sm font-medium mb-1">Date Range</label>
      <div className=" items-center gap-2">
        <input
          type="date"
          className="flex-1 rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary transition duration-300 ease-in-out hover:shadow-lg hover:border-primary outline-none"
        />
        <span className="hidden sm:block">to</span>
        <input
          type="date"
          className="flex-1 rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary transition duration-300 ease-in-out hover:shadow-lg hover:border-primary outline-none"
        />
        
      </div>
    </div>
  </div>

  {/* Right Column (Upload & Emoji) */}
  <div className="space-y-5 relative">
    <div className="flex gap-3 ">
      {/* Upload Logo */}
      
      <button
        onClick={() => fileInputRef.current.click()}
        className="px-4 py-3 border rounded-xl text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300 ease-in-out shadow-sm hover:shadow-lg"
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

      {/* Emoji Button */}
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="px-4 py-3 border rounded-xl text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300 ease-in-out shadow-sm hover:shadow-lg"
      >
        <Smile size={16} /> Emoji
      </button>
    </div>

    {/* Upload Preview */}
    <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-48 text-center text-gray-500 dark:text-gray-400 hover:border-primary/60 transition duration-300 ease-in-out relative">
      {selectedImage ? (
        <img
          src={selectedImage}
          alt="Uploaded Preview"
          className="h-full object-contain rounded-xl transition-transform duration-500 hover:scale-105"
        />
      ) : selectedEmoji ? (
        <span className="text-6xl transition-transform duration-500">{selectedEmoji}</span>
      ) : (
        <>
          <Upload size={24} />
          <p className="mt-2 text-sm">Upload project logo</p>
          <span className="text-xs">Min 600×600 PNG or JPEG</span>
        </>
      )}
    </div>

    {/* Emoji Picker Popup */}
    {showEmojiPicker && (
      <div className="absolute z-50 top-16 w-80 p-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl transition-all duration-300 ease-in-out">
        <EmojiPicker
          onEmojiClick={(emojiData) => {
            setSelectedEmoji(emojiData.emoji);
            setSelectedImage(null);
            setShowEmojiPicker(false);
          }}
        />
      </div>
    )}
  </div>
</div>



      {/* Footer */}
      <div className="flex justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>
        <Button className="bg-primary text-white">Create</Button>
      </div>
    </div>
  </div>
)}

    </>
  );
}
