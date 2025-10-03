"use client";

import React, { useState } from "react";
import { X, Upload, User, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MyRichTextEditor from "./MyRichTextEditor";

const teamMembers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Mark Lee", email: "mark@example.com" },
];

export default function AddTaskModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [comment, setComment] = useState("");
  const [description, setDescription] = useState("");

  const handleSelectMember = (member) => {
    if (!selectedMembers.find((m) => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
    }
    setDropdownOpen(false);
  };

  const handleFileUpload = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const removeFile = (file) => setFiles(files.filter((f) => f !== file));
  const removeMember = (id) =>
    setSelectedMembers(selectedMembers.filter((m) => m.id !== id));

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title,
      priority,
      description,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      assignees: selectedMembers,
      files,
      comment,
    };
    onSubmit(newTask);
    onClose();
    // reset
    setTitle("");
    setPriority("Low");
    setSelectedMembers([]);
    setFiles([]);
    setComment("");
    setDescription("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/90 dark:bg-gray-800/90 z-10">
              <h2 className="text-lg font-semibold">Add Task</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
              >
                <X />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-5">
              {/* Title */}
              <input
                type="text"
                placeholder="Todo Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition"
              />

              {/* Priority */}
              <div className="flex gap-4">
                {["Low", "Medium", "High"].map((p) => (
                  <label
                    key={p}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      value={p}
                      checked={priority === p}
                      onChange={() => setPriority(p)}
                      className="accent-purple-500"
                    />
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        p === "Low"
                          ? "bg-green-100 text-green-600"
                          : p === "Medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {p}
                    </span>
                  </label>
                ))}
              </div>

              {/* Assignees */}
              <div className="space-y-2">
                <label className="font-medium">Assignees</label>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((m) => (
                    <span
                      key={m.id}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full"
                    >
                      {m.email}
                      <button
                        onClick={() => removeMember(m.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="px-3 py-2 border rounded flex items-center gap-2 w-full hover:ring-1 ring-purple-400 transition"
                  >
                    <User size={16} /> Select Assignees
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bg-white dark:bg-gray-700 border rounded shadow w-full mt-1 z-10"
                      >
                        {teamMembers.map((member) => (
                          <li
                            key={member.id}
                            onClick={() => handleSelectMember(member)}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                          >
                            {member.name} - {member.email}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold block mb-2">Descriptions</label>
                <MyRichTextEditor value={description} onChange={setDescription} />
              </div>

              {/* Date & Time */}
              <div>
                <label className="font-semibold block mb-2">From - To</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-2 items-center">
                    <Calendar size={18} />
                    <input
                      type="date"
                      className="border px-2 py-1 rounded w-full"
                    />
                    <Clock size={18} />
                    <input
                      type="time"
                      className="border px-2 py-1 rounded w-full"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <Calendar size={18} />
                    <input
                      type="date"
                      className="border px-2 py-1 rounded w-full"
                    />
                    <Clock size={18} />
                    <input
                      type="time"
                      className="border px-2 py-1 rounded w-full"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="font-medium">Project Files</label>
                <div className="space-y-2 mt-2">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-gray-100 dark:bg-gray-600 px-3 py-2 rounded"
                    >
                      {file.name}
                      <button
                        onClick={() => removeFile(file)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Upload size={16} />
                    Upload File
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Comment */}
              <textarea
                rows="2"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
