"use client";
import React, { useContext, useEffect, useState } from "react";
import { Plus, MoreVertical, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddTaskModal from "./AddTaskModal";
import TaskDetailModal from "./TaskDetailModal";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../lib/useAxiosSecure";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { DataContext } from "../../../../context/DataContext";
import { useSession } from "next-auth/react";

export default function Todo() {
  const [columns, setColumns] = useState([
    { id: 1, title: "To Do", tasks: [] },
    { id: 2, title: "In Progress", tasks: [] },
    { id: 3, title: "Done", tasks: [] },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedProject, manager } = useContext(DataContext);
  const { data: session } = useSession();
  const userName = session?.user?.name || "Unknown User";
  const userEmail = session?.user?.email || "Unknown Email";
  const userImage = session?.user?.image || "/def-profile.jpeg";
  const [attendance, setAttendance] = useState("");

  // 🟢 Fetch all tasks from API
  useEffect(() => {
    if (!selectedProject?._id) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/api/tasks?projectId=${selectedProject._id}`);
        const allTasks = res.data?.data || [];

        const taskList = Array.isArray(allTasks) ? allTasks : [];

        const updatedColumns = columns.map((col) => ({
          ...col,
          tasks: taskList.filter((task) => task.columnTitle === col.title),
        }));


        setColumns(updatedColumns);
      } catch (err) {
        console.error("❌ Failed to load tasks:", err);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedProject?._id, axiosSecure]);

  // 🟢 Add Task
  const handleAddTask = async (newTask) => {
    try {
      const currentColumn = columns.find((col) => col.id === currentColumnId);
      const taskWithColumn = {
        ...newTask,
        projectId: selectedProject?._id,
        columnTitle: currentColumn?.title || "To Do",
      };

      const res = await axiosSecure.post("/api/tasks", taskWithColumn);

      if (res.data?.insertedId) {
        // ✅ Task added successfully
        taskWithColumn._id = res.data.insertedId;
        taskWithColumn.createdAt = new Date().toISOString();
        const newColumns = columns.map((col) =>
          col.id === currentColumnId
            ? { ...col, tasks: [...col.tasks, taskWithColumn] }
            : col
        );
        setColumns(newColumns);
        setCurrentColumnId(null);

        // 🟢 Send Notification
        await axiosSecure.post("/api/notifications", {
          projectId: selectedProject?._id,
          taskId: res?.data?.insertedId,
          user: {
            name: userName,
            email: userEmail,
            image: userImage,
          },
          message: `${userName} added a new task: ${newTask.title}`,
          type: "task_created",
        });

        Swal.fire("✅ Success", "Task added successfully!", "success");
      } else {
        Swal.fire("⚠️ Error", "Failed to save task!", "error");
      }
    } catch (error) {
      console.error("Task submission failed:", error);
      Swal.fire("❌ Error", "Something went wrong!", "error");
    }
  };


  // ❌ Delete Task
  const deleteTask = (colId, taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This task will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // 🔹 Find the deleted task before removing
          const deletedTask = columns
            .find((col) => col.id === colId)
            ?.tasks.find((t) => t._id === taskId);

          // 🔹 Delete task from backend
          await axiosSecure.delete(`/api/tasks/${taskId}`);

          // 🔹 Update frontend state
          const newColumns = columns.map((col) =>
            col.id === colId
              ? { ...col, tasks: col.tasks.filter((t) => t._id !== taskId) }
              : col
          );
          setColumns(newColumns);

          // ✅ Send notification
          await axiosSecure.post("/api/notifications", {
            projectId: selectedProject?._id,
            taskId,
            user: {
              name: userName,
              email: userEmail,
              image: userImage,
            },
            message: `${userName} deleted the task "${deletedTask?.title}"`,
            type: "task_deleted",
          });

          Swal.fire("Deleted!", "Your task has been deleted.", "success");
        } catch (err) {
          console.error("❌ Failed to delete task:", err);
          Swal.fire("❌ Error", "Failed to delete task.", "error");
        }
      }
    });
  };


  // ➕ Add New Column
  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    setColumns([
      ...columns,
      { id: Date.now(), title: newColumnTitle, tasks: [] },
    ]);
    setNewColumnTitle("");
    setAddingColumn(false);
  };

  // ↔ Move Column Left/Right
  const moveColumn = (index, direction) => {
    const newColumns = [...columns];
    const [removed] = newColumns.splice(index, 1);
    newColumns.splice(index + direction, 0, removed);
    setColumns(newColumns);
    setMenuOpen(null);
  };

  // 🗑 Delete Column
  const deleteColumn = (id) => {
    setColumns(columns.filter((col) => col.id !== id));
    setMenuOpen(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Kanban Board
      </h1>
      <div className="min-h-screen rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-6 py-8">


        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-center text-red-500 font-medium">{error}</p>
        ) : (
          <div className="flex gap-6 flex-wrap">
            {columns.map((col, index) => (
              <motion.div
                key={col.id}
                layout
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 w-72 hover:shadow-xl transition-all"
              >
                {/* Column Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-100">
                    {col.title}
                  </h2>

                  {/* Column Menu */}
                  <div className="relative">
                    {
                      manager === userEmail &&
                      (
                        <button
                          onClick={() =>
                            setMenuOpen(menuOpen === col.id ? null : col.id)
                          }
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <MoreVertical size={18} />
                        </button>
                      )
                    }

                    <AnimatePresence>
                      {menuOpen === col.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 shadow-lg rounded-lg z-10"
                        >
                          <ul className="text-sm">
                            {index > 0 && (
                              <li
                                onClick={() => moveColumn(index, -1)}
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                              >
                                Move left
                              </li>
                            )}
                            {index < columns.length - 1 && (
                              <li
                                onClick={() => moveColumn(index, 1)}
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                              >
                                Move right
                              </li>
                            )}
                            <li
                              onClick={() => deleteColumn(col.id)}
                              className="px-3 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-600 dark:hover:text-white cursor-pointer"
                            >
                              Delete column
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                  {col.tasks.length === 0 ? (
                    <p className="text-gray-400 text-sm italic text-center py-4">
                      No tasks yet
                    </p>
                  ) : (
                    col.tasks.map((task) => (
                      <motion.div
                        key={task._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 text-sm relative hover:shadow-md transition"
                        onClick={() => {
                          setSelectedTask(task);
                          setDetailOpen(true);
                        }}
                      >
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {task.title}
                        </p>
                        <div className="flex justify-between text-xs mt-2 items-center">
                          <span
                            className={`px-2 py-0.5 rounded-full font-medium ${task.priority === "High"
                              ? "bg-red-100 text-red-600"
                              : task.priority === "Low"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                              }`}
                          >
                            {task.priority}
                          </span>

                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="relative">
                              {
                                manager === userEmail &&
                                (
                                  <button
                                    onClick={() =>
                                      setMenuOpen(menuOpen === task._id ? null : task._id)
                                    }
                                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                  >
                                    <MoreVertical size={16} />
                                  </button>
                                )
                              }

                              <AnimatePresence>
                                {menuOpen === task._id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 shadow-lg rounded z-10"
                                  >
                                    <ul className="text-sm">
                                      <li
                                        onClick={() => deleteTask(col.id, task._id)}
                                        className="px-3 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-600 dark:hover:text-white cursor-pointer"
                                      >
                                        Delete
                                      </li>
                                    </ul>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Add Task Button */}
                {
                  manager === userEmail &&
                  (
                    <button
                      onClick={() => {
                        setCurrentColumnId(col.id);
                        setOpenModal(true);
                      }}
                      className="mt-4 w-full py-2 text-sm border rounded-lg flex items-center justify-center gap-1 font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <Plus size={16} /> Add Task
                    </button>
                  )
                }
              </motion.div>
            ))}

            {/* Add Column */}
            <div className="flex items-start">
              {!addingColumn ? (
                <div className="group relative">
                  {
                    manager === userEmail &&
                    (
                      <button
                        onClick={() => setAddingColumn(true)}
                        className="w-14 h-14 flex items-center justify-center border-2 border-dashed rounded-2xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <Plus />
                      </button>
                    )
                  }
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white dark:bg-gray-800 w-72 rounded-xl shadow-lg p-4"
                  >
                    <input
                      type="text"
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      placeholder="Enter column title"
                      className="w-full px-3 py-2 mb-3 rounded border focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleAddColumn}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setAddingColumn(false)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleAddTask}
        />

        {/* Task Detail Modal */}
        <TaskDetailModal
          currentUserEmail={session?.user?.email}
          setAttendance={setAttendance}
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          task={selectedTask}
          onStatusChange={({ status, columnTitle, taskId }) => {
            let taskToMove = null;

            // Remove task from current column
            const newColumns = columns.map((col) => {
              const remainingTasks = col.tasks.filter((t) => {
                if (t._id === taskId) {
                  taskToMove = { ...t, status, columnTitle };
                  return false;
                }
                return true;
              });
              return { ...col, tasks: remainingTasks };
            });

            // Add task to target column
            const updatedColumns = newColumns.map((col) => {
              if (col.title === columnTitle && taskToMove) {
                return { ...col, tasks: [...col.tasks, taskToMove] };
              }
              return col;
            });

            setColumns(updatedColumns);
            setDetailOpen(false);

            // ✅ Update backend
            axiosSecure
              .patch(`/api/tasks/${taskId}`, { status, columnTitle, attendance })
              .then(async () => {
                console.log("✅ Task updated!");

                // ✅ Send notification
                await axiosSecure.post("/api/notifications", {
                  projectId: selectedProject?._id,
                  taskId,
                  user: {
                    name: userName,
                    email: userEmail,
                    image: userImage,
                  },
                  message: `${userName} changed task "${taskToMove?.title}" status to "${status}"`,
                  type: "task_status_change",
                });

                console.log("📩 Notification sent!");
              })
              .catch((err) => console.error("❌ Failed to update task:", err));
          }}

          onEdit={(task) => console.log("Edit clicked", task)}
        />
      </div>
    </div>

  );
}
