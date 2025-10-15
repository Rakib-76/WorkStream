"use client";
import React from "react";
import { motion } from "framer-motion";

export default function LoadingSpinner({ text = "Loading..." }) {
    return (
        <motion.div
            className="flex flex-col justify-center items-center h-60 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <span className="loading loading-spinner text-primary w-10 h-10"></span>
            <p className="text-gray-500 dark:text-gray-300 font-medium text-sm">
                {text}
            </p>
        </motion.div>
    );
}
