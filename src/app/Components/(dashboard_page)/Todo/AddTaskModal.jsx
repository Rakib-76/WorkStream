"use client";
import React, { useContext } from "react";
import { X, Upload, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MyRichTextEditor from "./MyRichTextEditor";
import { DataContext } from "../../../../context/DataContext";
import { MemberInput } from "../../../../lib/MemberInput";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";

export default function AddTaskModal({ isOpen, onClose, onSubmit }) {
  const { data: session } = useSession();
  const { selectedProject } = useContext(DataContext);

  // ✅ useForm hook
  const { register, handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      title: "",
      priority: "Low",
      selectedMembers: [],
      files: [],
      comment: "",
      description: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    },
  });

  const files = watch("files") || [];

  // ✅ File Upload Handler
  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files);
    const prev = files || [];
    const newFiles = [...prev, ...uploaded];
    reset({ ...watch(), files: newFiles });
  };

  const removeFile = (file) => {
    const updated = files.filter((f) => f !== file);
    reset({ ...watch(), files: updated });
  };

  // ✅ Submit Handler
  const onFormSubmit = (data) => {
    if (!data.title.trim()) return;

    const newTask = {
      projectId: selectedProject?._id || null,
      title: data.title,
      priority: data.priority,
      description: data.description,
      startDate: data.startDate || "-",
      endDate: data.endDate || "-",
      startTime: data.startTime || "-",
      endTime: data.endTime || "-",
      creatorEmail: session?.user?.email,
      assigneeTo: data.selectedMembers,
      files: data.files,
      comments: data.comment
        ? [
          {
            id: Date.now(),
            text: data.comment,
            author: "You",
            time: new Date().toLocaleString(),
          },
        ]
        : [],
      status: "Pending",
    };

    onSubmit(newTask);
    onClose();
    reset();
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
            <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 flex-1 overflow-y-auto space-y-5">
              {/* Title */}
              <input
                type="text"
                placeholder="Todo Title"
                {...register("title")}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition"
              />

              {/* Priority */}
              <div className="flex gap-4">
                {["Low", "Medium", "High"].map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      value={p}
                      {...register("priority")}
                      className="accent-purple-500"
                    />
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${p === "Low"
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

              {/* ✅ Assignee To */}
              <div className="space-y-2">
                <label className="font-medium">Assignee To</label>
                <Controller
                  name="selectedMembers"
                  control={control}
                  render={({ field }) => (
                    <MemberInput value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold block mb-2">Descriptions</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <MyRichTextEditor value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>

              {/* Date & Time */}
              <div>
                <label className="font-semibold block mb-2">From - To</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-2 items-center">
                    <Calendar size={18} />
                    <input type="date" {...register("startDate")} className="border px-2 py-1 rounded w-full" />
                    <Clock size={18} />
                    <input type="time" {...register("startTime")} className="border px-2 py-1 rounded w-full" />
                  </div>
                  <div className="flex gap-2 items-center">
                    <Calendar size={18} />
                    <input type="date" {...register("endDate")} className="border px-2 py-1 rounded w-full" />
                    <Clock size={18} />
                    <input type="time" {...register("endTime")} className="border px-2 py-1 rounded w-full" />
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
                        type="button"
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
                    <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Comment */}
              <textarea
                rows="2"
                placeholder="Add a comment..."
                {...register("comment")}
                className="w-full border rounded px-3 py-2"
              />

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
