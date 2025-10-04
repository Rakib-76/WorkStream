"use client";
import React from "react";
import { X, User, Paperclip, MessageSquare, Calendar, Clock, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onStatusChange,
  onEdit,
}) {
  if (!task) return null;

  // Handle Status Change with SweetAlert
  const handleStatus = (status) => {
    if (status === "Completed") {
      Swal.fire({
        title: "🎉 Congratulations!",
        text: "Task has been marked as completed successfully.",
        icon: "success",
        confirmButtonColor: "#22c55e",
      });
    } else {
      Swal.fire({
        title: "⚠️ Reminder",
        text: "As soon as possible complete it!",
        icon: "warning",
        confirmButtonColor: "#eab308",
      });
    }
    onStatusChange(status);
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {task.title}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {task.priority}
                </span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              >
                <X />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-5">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-1">Description</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {task.description || "No description"}
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> Created: {task.createdDate}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> Due: {task.dueDate}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} /> From: {task.startDate}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} /> To: {task.endDate}
                </div>
              </div>

              {/* Assignees */}
              <div>
                <h3 className="font-semibold mb-1">Assignees</h3>
                <div className="flex flex-wrap gap-2">
                  {task.assignees?.map((m) => (
                    <span
                      key={m.id}
                      className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-sm flex items-center gap-2"
                    >
                      <User size={14} /> {m.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attachments & Comments */}
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Paperclip size={14} /> {task.files?.length || 0} attachments
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} /> {task.comments?.length || 0} comments
                </div>
              </div>

              {/* Attendance */}
              <div>
                <h3 className="font-semibold mb-1">Attendance</h3>
                <select className="border rounded px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 transition">
                  <option>Present</option>
                  <option>Absent</option>
                  <option>Late</option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">
              <button
                onClick={() => onEdit(task)} // Pass task info to edit modal
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
              >
                <Edit3 size={16} /> Edit
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatus("Pending")}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                >
                  Pending
                </button>
                <button
                  onClick={() => handleStatus("In Progress")}
                  className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleStatus("Completed")}
                  className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
                >
                  Complete
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
