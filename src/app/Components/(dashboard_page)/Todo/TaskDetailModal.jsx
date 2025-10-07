"use client";
import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Paperclip,
  MessageSquare,
  Calendar,
  Clock,
  Edit3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import dayjs from "dayjs"; // npm i dayjs

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onStatusChange,
  onEdit,
}) {
  if (!task) return null;

  const [attendance, setAttendance] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(task.comments || []);

  // Generate attendance days between startDate and endDate
  useEffect(() => {
    if (task.startDate && task.endDate) {
      const start = dayjs(task.startDate);
      const end = dayjs(task.endDate);
      const temp = [];
      for (let d = start; d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
        temp.push({
          date: d.format("YYYY-MM-DD"),
          status: "Pending",
        });
      }
      setAttendance(temp);
    }
  }, [task]);

  // Auto mark absent if date expired
  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    setAttendance((prev) =>
      prev.map((a) => {
        if (dayjs(a.date).isBefore(today) && a.status === "Pending") {
          return { ...a, status: "Absent" };
        }
        return a;
      })
    );
  }, []);

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

  const markAttendance = (date) => {
    const now = dayjs();
    const currentDate = now.format("YYYY-MM-DD");
    const currentHour = now.hour();

    setAttendance((prev) =>
      prev.map((a) => {
        if (a.date === date) {
          if (date !== currentDate) {
            Swal.fire({
              icon: "error",
              title: "Date Expired!",
              text: "You can't mark attendance for past or future dates.",
            });
            return a;
          }
          if (a.status !== "Pending") return a;

          if (currentHour >= 10) {
            Swal.fire({
              icon: "info",
              title: "Late Attendance",
              text: "Marked as late since it's after 10 AM.",
            });
            return { ...a, status: "Late" };
          } else {
            Swal.fire({
              icon: "success",
              title: "Present!",
              text: "Attendance marked as Present.",
            });
            return { ...a, status: "Present" };
          }
        }
        return a;
      })
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      text: newComment,
      author: "You",
      time: dayjs().format("YYYY-MM-DD HH:mm"),
    };
    setComments([...comments, commentObj]);
    setNewComment("");
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
    <Calendar size={16} /> Created: {task.createdDate || "Not available"}
  </div>
  <div className="flex items-center gap-2">
    <Calendar size={16} /> Due: {task.endDate || "Not available"}
  </div>
  <div className="flex items-center gap-2">
    <Clock size={16} /> From: {task.startDate || "-"}
  </div>
  <div className="flex items-center gap-2">
    <Clock size={16} /> To: {task.endDate || "-"}
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
                  <MessageSquare size={14} /> {comments.length} comments
                </div>
              </div>

              {/* Attendance */}
              <div>
                <h3 className="font-semibold mb-2">Attendance</h3>
                <div className="space-y-2">
                  {attendance.map((a) => (
                    <div
                      key={a.date}
                      className="flex items-center justify-between border dark:border-gray-700 rounded-lg px-4 py-2"
                    >
                      <span>{a.date}</span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => markAttendance(a.date)}
                        className={`px-3 py-1 rounded text-white ${
                          a.status === "Present"
                            ? "bg-green-500"
                            : a.status === "Late"
                            ? "bg-yellow-500"
                            : a.status === "Absent"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {a.status}
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare size={16} /> Comments
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2"
                    >
                      <p className="text-sm">{c.text}</p>
                      <span className="text-xs text-gray-500">
                        — {c.author}, {c.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">
              <button
                onClick={() => onEdit(task)}
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
