"use client";

import { useState } from "react";
// import img from "next/img";
import { MoreVertical, MessageSquare, Phone } from "lucide-react";

// ---- Team Members Data ----
const members = [
  {
    id: 1,
    name: "Michael Walker",
    role: "CEO",
    company: "BrightWave Innovations",
    project: "Office Management App",
    img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png",
  },
  {
    id: 2,
    name: "Sophie Headrick",
    role: "Manager",
    company: "Stellar Dynamics",
    project: "Clinic Management",
    img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png",
  },
  {
    id: 3,
    name: "Cameron Drake",
    role: "Director",
    company: "Quantum Nexus",
    project: "Educational Platform",
    img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png",
  },
  {
    id: 4,
    name: "Doris Crowley",
    role: "Consultant",
    company: "EcoVision Enterprises",
    project: "Navigation & Safety App",
    img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png",
  },
  {
    id: 5,
    name: "Kathleen Gutierrez",
    role: "Director",
    company: "Innova Systems",
    project: "Service Booking Software",
    img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png",
  },
  {
    id: 6,
    name: "Bruce Wright",
    role: "CEO",
    company: "NextEra Labs",
    project: "Hotel Booking App",
    img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png",
  },
];

// ---- Member Card ----
function MemberCard({ member }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-72 sm:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow hover:shadow-lg transition">
      {/* Header Row */}
      <div className="flex justify-between items-start">
        <input type="checkbox" className="mt-1 accent-primary" />

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-1 w-24 bg-white dark:bg-gray-700 border
                         border-gray-200 dark:border-gray-600 rounded-md shadow-md z-20"
            >
              <button
                onClick={() => setOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center mt-2">
        <div className="relative">
          <img
            src={member.img}
            alt={member.name}
            width={70}
            height={70}
            className="rounded-full border-2 border-pink-400 object-cover"
          />
         
          <span className="absolute bottom-1 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <h3 className="mt-2 font-semibold text-gray-800 dark:text-gray-100">
          {member.name}
        </h3>
        <span className="text-xs px-3 py-1 mt-1 bg-pink-100 text-pink-600 rounded-full">
          {member.role}
        </span>
      </div>

      {/* Project */}
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">
        Project : <span className="font-medium">{member.project}</span>
      </p>

      {/* Progress bar (Demo static 40%) */}
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full">
          <div className="h-1 bg-yellow-400 rounded-full w-[40%]" />
        </div>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
          40%
        </span>
      </div>

      {/* Dummy team avatars */}
      <div className="mt-3 flex -space-x-3">
        <img src="/team/a1.jpg" alt="member" width={28} height={28} className="rounded-full border-2 border-white" />
        <img src="/team/a2.jpg" alt="member" width={28} height={28} className="rounded-full border-2 border-white" />
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-400 text-white text-xs font-medium border-2 border-white">
          +2
        </div>
      </div>

      {/* Company + icons */}
      <div className="mt-4 flex items-center justify-between">

        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Company: {member.company}
        </p>
        
      </div>
    </div>
  );
}

// ---- Main Team Page ----
export default function Team() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Team</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
