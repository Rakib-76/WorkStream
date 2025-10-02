"use client";
import React, { useState } from "react";
import { Plus, MoreVertical, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddTaskModal from "./AddTaskModal";

export default function Todo() {
  const [columns, setColumns] = useState([
    { id: 1, title: "To Do", tasks: [] },
    { id: 2, title: "In Progress", tasks: [] },
    { id: 3, title: "Done", tasks: [] },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);

  // For creating new column
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // add task
  const handleAddTask = (newTask) => {
    const newColumns = [...columns];
    newColumns[0].tasks.push(newTask); // default "To Do"
    setColumns(newColumns);
  };

  // delete column
  const deleteColumn = (id) => {
    setColumns(columns.filter((col) => col.id !== id));
    setMenuOpen(null);
  };

  // move column left or right
  const moveColumn = (index, direction) => {
    const newColumns = [...columns];
    const [removed] = newColumns.splice(index, 1);
    newColumns.splice(index + direction, 0, removed);
    setColumns(newColumns);
    setMenuOpen(null);
  };

  // add column
  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    setColumns([
      ...columns,
      { id: Date.now(), title: newColumnTitle, tasks: [] },
    ]);
    setNewColumnTitle("");
    setAddingColumn(false);
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>

      <div className="flex gap-4 flex-wrap">
        {columns.map((col, index) => (
          <motion.div
            key={col.id}
            layout
            className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-3 relative w-60"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">{col.title}</h2>

              {/* Three Dot Menu */}
              <div className="relative">
                <button
                  onClick={() =>
                    setMenuOpen(menuOpen === col.id ? null : col.id)
                  }
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <MoreVertical size={18} />
                </button>

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
                            Move column left
                          </li>
                        )}
                        {index < columns.length - 1 && (
                          <li
                            onClick={() => moveColumn(index, 1)}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                          >
                            Move column right
                          </li>
                        )}
                        <li
                          onClick={() => deleteColumn(col.id)}
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

            {/* Tasks */}
            <div className="space-y-2">
              {col.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm border text-sm"
                >
                  <p className="font-medium">{task.title}</p>
                  <div className="flex justify-between text-xs mt-2">
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-600"
                          : task.priority === "Low"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-gray-500">{task.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => setOpenModal(true)}
              className="mt-3 w-full py-2 text-sm text-gray-500 dark:text-gray-300 border rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Plus size={16} className="inline mr-1" /> Add Task
            </button>
          </motion.div>
        ))}

        {/* Create Column Button */}
        <div className="flex items-start">
          {!addingColumn ? (
            <div className="group relative">
              <button
                onClick={() => setAddingColumn(true)}
                className="w-12 h-12 flex items-center justify-center border-2 border-dashed rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus />
              </button>
              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-gray-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Create Column
              </span>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-gray-50 dark:bg-gray-800 w-60 rounded-lg shadow p-3"
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

      {/* Modal */}
      <AddTaskModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
}
