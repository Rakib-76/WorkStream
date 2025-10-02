"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { X } from "lucide-react";

// ---- Fake Team Members ----
const members = [
  { id: 1, name: "Michael Walker", role: "CEO", company: "BrightWave Innovations", project: "Office Management App", img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png" },
  { id: 2, name: "Sophie Headrick", role: "Manager", company: "Stellar Dynamics", project: "Clinic Management", img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png" },
  { id: 3, name: "Cameron Drake", role: "Director", company: "Quantum Nexus", project: "Educational Platform", img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png" },
  { id: 4, name: "Doris Crowley", role: "Consultant", company: "EcoVision Enterprises", project: "Navigation & Safety App", img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png" },
];

// ---- Fake Email Data ----
const fakeEmails = [
  { email: "alex@example.com", name: "Alex Carter", img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png", company: "BrightWave Innovations" },
  { email: "julia@example.com", name: "Julia Roberts", img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png", company: "Stellar Dynamics" },
  { email: "daniel@example.com", name: "Daniel White", img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png", company: "Quantum Nexus" },
];

// ---- Member Card ----
function MemberCard({ member, onViewDetails }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow hover:shadow-lg transition duration-300">
      {/* Header */}
      <div className="flex justify-between items-start">
        <input type="checkbox" className="mt-1 accent-primary" />
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          {open && (
            <div className="absolute right-0 mt-1 w-24 bg-white dark:bg-gray-700 border rounded-md shadow-md z-20 animate-fade-in">
              <button
                onClick={() => onViewDetails(member)}
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
        <img src={member.img} alt={member.name} className="w-16 h-16 rounded-full border-2 border-pink-400 object-cover" />
        <h3 className="mt-2 font-semibold text-gray-800 dark:text-gray-100">{member.name}</h3>
        <span className="text-xs px-3 py-1 mt-1 bg-pink-100 text-pink-600 rounded-full">{member.role}</span>
      </div>

      {/* Project */}
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">
        Project : <span className="font-medium">{member.project}</span>
      </p>

      {/* Progress */}
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-[60%] transition-all duration-500" />
        </div>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">60%</span>
      </div>

      {/* Total members & Company */}
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        <b>Total Members:</b> {Math.floor(Math.random() * 10) + 3}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        <b>Company:</b> {member.company}
      </p>
    </div>
  );
}

// ---- Member Details (Table View + Add Form) ----
 function MemberDetails({ member, onBack }) {
  const [team, setTeam] = useState([
    { name: "Alex Carter", email: "alex@example.com", role: "Leader", company: "BrightWave Innovations", img: fakeEmails[0].img },
    { name: "Julia Roberts", email: "julia@example.com", role: "Member", company: "Stellar Dynamics", img: fakeEmails[1].img },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Member");

    // search filter
  const filteredEmails = fakeEmails.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (selectedUser) {
      setTeam([...team, { ...selectedUser, role: selectedRole }]);
      setShowModal(false);
      alert("✅ Member Added Successfully!");
    }
  };
  return (
     <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md animate-slide-up">
      {/* Back */}
      <button onClick={onBack} className="mb-4 text-sm text-blue-600 hover:underline">&larr; Back</button>

      {/* Topbar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Project Details</h2>
        <div className="flex gap-2 w-full md:w-auto">
          {/* Searchbar */}
          <input
            type="text"
            placeholder="🔍 Search member..."
            className="flex-1 md:flex-none border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary bg-gray-50 dark:bg-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Add Button */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
          >
            + Add Member
          </button>
        </div>
      </div>

      {/* Project Info */}
      <div className="mb-6 space-y-1">
        <p className="text-gray-600 dark:text-gray-300"><b>Project:</b> {member.project}</p>
        <p className="text-gray-600 dark:text-gray-300"><b>Company:</b> {member.company}</p>
        <p className="text-gray-600 dark:text-gray-300"><b>Leader:</b> {team.find(t => t.role === "Leader")?.name || "N/A"}</p>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">Member</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Position</th>
            </tr>
          </thead>
          <tbody>
            {team.map((t, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="p-3 flex items-center gap-2">
                  <img src={t.img} className="w-8 h-8 rounded-full" />
                  <span className="font-medium">{t.name}</span>
                  {t.role === "Leader" && <span className="ml-1 text-yellow-500">⭐</span>}
                </td>
                <td className="p-3">{t.email}</td>
                <td className="p-3">{t.company}</td>
                <td className="p-3">{t.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Member */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white/30 dark:bg-gray-800/40 backdrop-blur-lg p-6 rounded-xl shadow-xl w-[90%] max-w-md animate-slide-up relative">
            {/* Close */}
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-600 dark:text-gray-200">
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">➕ Add Member</h3>

            {/* Search user */}
            <input
              type="text"
              placeholder="Search by email or name..."
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-primary bg-white/60 dark:bg-gray-700/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="max-h-40 overflow-y-auto mb-3">
              {filteredEmails.map((user, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 ${selectedUser?.email === user.email ? "bg-gray-300 dark:bg-gray-700" : ""}`}
                >
                  <img src={user.img} className="w-8 h-8 rounded-full" />
                  <span>{user.name} ({user.email})</span>
                </div>
              ))}
            </div>

            {/* Role Select */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-3 bg-white/60 dark:bg-gray-700/50"
            >
              <option>Member</option>
              <option>Leader</option>
            </select>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg shadow hover:scale-105 transition"
            >
              Add Member
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Main Team ----
export default function Team() {
  const [selectedMember, setSelectedMember] = useState(null);

  if (selectedMember) {
    return <MemberDetails member={selectedMember} onBack={() => setSelectedMember(null)} />;
  }

  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Team</h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} onViewDetails={setSelectedMember} />
        ))}
      </div>
    </section>
  );
}
