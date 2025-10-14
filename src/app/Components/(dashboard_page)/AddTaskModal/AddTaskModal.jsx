"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag, UserPlus, Flag, Clock } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../lib/useAxiosSecure";

export default function AddTaskModal({ isOpen, onClose, projectId, onTaskAdded }) {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const newTask = {
            ...data,
            projectId,
            createdAt: new Date(),
            lastUpdated: new Date(),
            tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
        };

        try {
            await axiosSecure.post("/api/tasks", newTask);
            Swal.fire({ icon: "success", title: "Task Added Successfully!", showConfirmButton: false, timer: 1500 });
            reset();
            onClose();
            onTaskAdded();
        } catch (error) {
            Swal.fire({ icon: "error", title: "Failed to Add Task!", text: error.message });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 dark:text-white">
                            Create New Task
                        </h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* Input Field */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter task title"
                                    {...register("title", { required: "Title is required" })}
                                    className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                            </div>

                            {/* Textarea */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Write task details..."
                                    {...register("description")}
                                    className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition"
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-200">
                                        <Calendar size={14} /> Start Date
                                    </label>
                                    <input
                                        type="date"
                                        {...register("startDate", { required: "Start date required" })}
                                        className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-200">
                                        <Clock size={14} /> Deadline
                                    </label>
                                    <input
                                        type="date"
                                        {...register("deadline", { required: "Deadline required" })}
                                        className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Assignee + Priority */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-200">
                                        <UserPlus size={14} /> Assignee
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter username"
                                        {...register("assignee")}
                                        className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-200">
                                        <Flag size={14} /> Priority
                                    </label>
                                    <select
                                        {...register("priority")}
                                        defaultValue="medium"
                                        className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-200">
                                    <Tag size={14} /> Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    placeholder="frontend, api, ui"
                                    {...register("tags")}
                                    className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-md transition"
                            >
                                Add Task
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
