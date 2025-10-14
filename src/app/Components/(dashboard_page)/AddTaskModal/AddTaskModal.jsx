"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag, UserPlus, Flag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../lib/useAxiosSecure";

export default function AddTaskModal({ isOpen, onClose, projectId }) {
    const axiosSecure = useAxiosSecure();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const newTask = {
            ...data,
            projectId,
            createdAt: new Date(),
            lastUpdated: new Date(),
            tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        };

        try {
            await axiosSecure.post("/api/tasks", newTask);
            Swal.fire({
                icon: "success",
                title: "Task Added Successfully!",
                showConfirmButton: false,
                timer: 1500,
            });
            reset();
            onClose();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed to Add Task!",
                text: error.message,
            });
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
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 dark:text-white">
                            Create New Task
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    type="text"
                                    placeholder="Enter task title"
                                    {...register("title", { required: "Title is required" })}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Task details..."
                                    rows={3}
                                    {...register("description")}
                                />
                            </div>

                            {/* Start and Deadline */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <Calendar size={14} /> Start Date
                                    </label>
                                    <Input
                                        type="date"
                                        {...register("startDate", { required: "Start date required" })}
                                    />
                                    {errors.startDate && (
                                        <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <Clock size={14} /> Deadline
                                    </label>
                                    <Input
                                        type="date"
                                        {...register("deadline", { required: "Deadline required" })}
                                    />
                                    {errors.deadline && (
                                        <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Assignee and Priority */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <UserPlus size={14} /> Assignee
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Enter username"
                                        {...register("assignee")}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <Flag size={14} /> Priority
                                    </label>
                                    <select
                                        {...register("priority")}
                                        className="select select-bordered w-full"
                                        defaultValue="medium"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="text-sm font-medium flex items-center gap-1">
                                    <Tag size={14} /> Tags (comma separated)
                                </label>
                                <Input
                                    type="text"
                                    placeholder="frontend, auth, ui"
                                    {...register("tags")}
                                />
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                                >
                                    Add Task
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
