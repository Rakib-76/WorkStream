
"use client";
import React from "react";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {title && <h2 className="text-xl text-black font-semibold mb-4">{title}</h2>}
        <div>{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
