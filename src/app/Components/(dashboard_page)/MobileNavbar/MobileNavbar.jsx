"use client";

import { useState, useRef } from "react";
import { Menu, PlusCircle, Waves, X, Upload, Smile } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "../../../Provider/ThemeToggle";
import Link from "next/link";
import Button from "../../../Components/(dashboard_page)/UI/Button";
import EmojiPicker from "emoji-picker-react";
import { useForm } from "react-hook-form";
import { MemberInput } from "../Dashboard_nav/MemberInput";

export default function MobileNavbar({ activeItem, setActiveItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const fileInputRef = useRef(null);

  const { register, handleSubmit } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(URL.createObjectURL(file));
  };

  const onSubmit = (data) => {
    console.log("Submitted Data:", {
      ...data,
      logo: selectedImage,
      emoji: selectedEmoji,
    });
    setIsModalOpen(false);
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
    { name: "ideas", label: "Sharing Ideas" },
  ];

  return (
    <>
      {/* Navbar Top */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border flex items-center justify-between px-4 py-3 z-50">
        <Link href="/" className="group ">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-primary to-secondary rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md">
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
                src="/avatar.png"
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="font-medium">User Name</span>
            </div>
            <ThemeToggle />
          </div>

          {/* Create + Projects */}
          <div className="p-4 border-b border-border flex gap-3">
            <Button
              size="sm"
              className="flex gap-2 items-center bg-primary text-primary-foreground"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4" />
              Create
            </Button>
            <button className="border px-4 py-2 rounded-lg flex-1 hover:bg-muted transition">
              Projects
            </button>
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
          </ul>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
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

            {/* Form Body */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Left */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project Name *
                  </label>
                  <input
                    {...register("projectName")}
                    type="text"
                    className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company Name
                  </label>
                  <input
                    {...register("companyName")}
                    type="text"
                    className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows="3"
                    className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none resize-none"
                    placeholder="Write project details..."
                  />
                </div>
              </div>

              {/* Middle */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Team Role
                  </label>
                  <select
                    {...register("teamRole")}
                    className="w-full rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option>Leader</option>
                    <option>Member</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Add Members
                  </label>
                  <MemberInput {...register("members")} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      {...register("startDate")}
                      type="date"
                      className="flex-1 rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                    />
                    <span>to</span>
                    <input
                      {...register("endDate")}
                      type="date"
                      className="flex-1 rounded-xl border px-4 py-3 text-sm dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-5 relative">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-3 border rounded-xl text-sm flex items-center gap-2"
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
                    className="px-4 py-3 border rounded-xl text-sm flex items-center gap-2"
                  >
                    <Smile size={16} /> Emoji
                  </button>
                </div>

                <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-48 text-center text-gray-500 dark:text-gray-400">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Uploaded Preview"
                      className="h-full object-contain rounded-xl"
                    />
                  ) : selectedEmoji ? (
                    <span className="text-6xl">{selectedEmoji}</span>
                  ) : (
                    <>
                      <Upload size={24} />
                      <p className="mt-2 text-sm">Upload project logo</p>
                      <span className="text-xs">Min 600×600 PNG/JPEG</span>
                    </>
                  )}
                </div>

                {showEmojiPicker && (
                  <div className="absolute z-50 top-20 left-0 w-80 p-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
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
            </form>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-primary text-white"
                onClick={handleSubmit(onSubmit)}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
