"use client";
import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Clock,
  MessageSquare,
  User,
  Paperclip,
  Edit3,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import dayjs from "dayjs";

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onStatusChange,
  onEdit,
}) {
  if (!isOpen || !task) return null;

  const [comments, setComments] = useState(task?.comments || []);
  const [newComment, setNewComment] = useState("");

  // ✅ STATUS BUTTONS
  const markPending = () => {
    Swal.fire("Pending!", "Task marked as pending.", "info");
    onStatusChange({
      status: "Pending",
      columnTitle: "To Do",
      taskId: task._id,
    });
  };

  const markInProgress = () => {
    Swal.fire("In Progress!", "Task is now in progress.", "info");
    onStatusChange({
      status: "In Progress",
      columnTitle: "In Progress",
      taskId: task._id,
    });
  };

  const markCompleted = () => {
    Swal.fire("Completed!", "Task completed successfully.", "success");
    onStatusChange({
      status: "Completed",
      columnTitle: "Done",
      taskId: task._id,
    });
  };

  // ✅ COMMENT ADD
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
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center p-5 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-xl font-semibold flex items-center gap-2">
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
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
              >
                <X />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 overflow-y-auto space-y-5 text-gray-800 dark:text-gray-200">
              {/* DESCRIPTION */}
              <section>
                <h3 className="font-semibold mb-2">📋 Description</h3>
                <p className="text-sm leading-relaxed">
                  {task.description || "No description provided."}
                </p>
              </section>

              {/* DATES */}
              <section className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> Created:{" "}
                  {dayjs(task.createdAt).format("YYYY-MM-DD")}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> End: {task.endDate || "-"}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} /> Start Time: {task.startTime || "-"}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} /> End Time: {task.endTime || "-"}
                </div>
              </section>

              {/* ASSIGNEES */}
              <section>
                <h3 className="font-semibold mb-2">👥 Assignees</h3>
                <div className="flex flex-wrap gap-2">
                  {task.assigneeTo?.length ? (
                    task.assigneeTo.map((email, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center gap-2 text-sm"
                      >
                        <User size={14} /> {email}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No assignees.</p>
                  )}
                </div>
              </section>

              {/* ✅ ATTENDANCE SECTION */}
              <section>
                <h3 className="font-semibold mb-2">📅 Attendance</h3>
                <AttendanceSection
                  task={task}
                  currentUserEmail={task.loggedInUser}
                />
              </section>
              {/* Files Section */}
              <section>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Paperclip size={16} /> Files
                </h3>
                {task.files?.length ? (
                  <div className="flex flex-col gap-2">
                    {task.files.map((file, idx) => (
                      <a
                        key={idx}
                        href={file.url} // Cloudinary URL or file URL
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex justify-between items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                      >
                        <span>{file.name}</span>
                        <Download size={16} />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No files uploaded.</p>
                )}
              </section>

              {/* COMMENTS */}
              <section>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare size={16} /> Comments
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3"
                    >
                      <p className="text-sm">{c.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        — {c.author}, {c.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Post
                  </button>
                </div>
              </section>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900 sticky bottom-0">
              <button
                onClick={() => onEdit(task)}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
              >
                <Edit3 size={16} /> Edit Task
              </button>
              <div className="flex gap-2">
                <button
                  onClick={markPending}
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Pending
                </button>
                <button
                  onClick={markInProgress}
                  className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  In Progress
                </button>
                <button
                  onClick={markCompleted}
                  className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
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

/* ✅ Attendance Section */
const AttendanceSection = ({ task, currentUserEmail }) => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (task.startDate && task.endDate) {
      const start = dayjs(task.startDate);
      const end = dayjs(task.endDate);
      const dates = [];

      for (let d = start; d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
        const dayName = d.format("dddd");
        const isHoliday = dayName === "Friday" || dayName === "Saturday";
        dates.push({
          date: d.format("YYYY-MM-DD"),
          status: isHoliday ? "Holiday" : "Pending",
        });
      }
// kjnkn
      setAttendance(dates);
    }
  }, [task]);

  const handleAttendance = (index) => {
    const today = dayjs().format("YYYY-MM-DD");
    setAttendance((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        // শুধুমাত্র আজকের তারিখের জন্য change হবে
        if (item.date !== today) return item;

        const now = dayjs();
        const tenAM = dayjs().hour(10).minute(0).second(0);
        if (item.status === "Pending")
          return { ...item, status: now.isAfter(tenAM) ? "Late" : "Present" };
        return item;
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";
      case "Late":
        return "bg-yellow-100 text-yellow-700";
      case "Holiday":
        return "bg-gray-200 text-gray-500";
      default:
        return "bg-blue-100 text-blue-700"; // Pending
    }
  };

  return (
    <div className="space-y-2">
      {attendance.map((item, index) => {
        const today = dayjs().format("YYYY-MM-DD");
        const isToday = item.date === today;
        return (
          <div
            key={item.date}
            className="flex items-center justify-between border rounded-lg px-3 py-2"
          >
            <span>{item.date}</span>
            {item.status === "Holiday" ? (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}
              >
                Holiday
              </span>
            ) : (
              <button
                onClick={() => handleAttendance(index)}
                disabled={!isToday || !task.assigneeTo?.includes(currentUserEmail)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  item.status
                )} ${!isToday ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {item.status}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
