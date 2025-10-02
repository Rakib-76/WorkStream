"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";

// ---- Fake Email Data ----
const fakeEmails = [
  { email: "alex@example.com", name: "Alex Carter", img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png", company: "BrightWave Innovations" },
  { email: "julia@example.com", name: "Julia Roberts", img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png", company: "Stellar Dynamics" },
  { email: "daniel@example.com", name: "Daniel White", img: "https://i.ibb.co.com/Gfy3VSw8/Chat-GPT-Image-Sep-26-2025-02-40-08-PM.png", company: "Quantum Nexus" },
];

export default function Team() {
  const [team, setTeam] = useState([
    { name: "Alex Carter", email: "alex@example.com", role: "Leader", company: "BrightWave Innovations", img: fakeEmails[0].img },
    { name: "Julia Roberts", email: "julia@example.com", role: "Member", company: "Stellar Dynamics", img: fakeEmails[1].img },
  ]);

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // filter users (skip already added members)
  const filteredEmails = fakeEmails.filter(
    (u) =>
      !team.some((t) => t.email === u.email) &&
      searchQuery.trim() !== "" &&
      (u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdd = (role) => {
    if (selectedUser) {
      setTeam([...team, { ...selectedUser, role }]);
      setShowMemberModal(false);
      setShowLeaderModal(false);
      setSearchQuery("");
      setSelectedUser(null);
      alert(`✅ ${role} Added Successfully!`);
    }
  };

  return (
    <section className="">
      {/* Header + Add Member Btn */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Team Details</h2>
        <div className="relative group inline-block">
          <button
            onClick={() => setShowMemberModal(true)}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition"
          >
            + Add Member
          </button>
          <span className="absolute right-0 -top-8 scale-0 group-hover:scale-100 transition bg-black text-white text-xs rounded px-2 py-1">
            Add Member
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="mb-6 space-y-1 bg-gradient-to-r from-pink-50 to-red-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow">
        <p className="text-gray-600 dark:text-gray-300"><b>Project:</b> Office Management App</p>
        <p className="text-gray-600 dark:text-gray-300"><b>Company:</b> BrightWave Innovations</p>
        <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2 relative">
          <b>Leader:</b> {team.find(t => t.role === "Leader")?.name || "N/A"} 
          {/* plus icon with tooltip */}
          <div className="relative group">
            <button 
              onClick={() => setShowLeaderModal(true)} 
              className="ml-2 bg-green-500 hover:bg-green-600 text-white p-1 rounded-full shadow transition"
            >
              <Plus size={16}/>
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 -top-8 scale-0 group-hover:scale-100 transition bg-black text-white text-xs rounded px-2 py-1">
              Add Leader
            </span>
          </div>
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="w-full border-collapse overflow-hidden">
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

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-xl shadow-xl w-[90%] max-w-md animate-slide-up relative">
            <button onClick={() => setShowMemberModal(false)} className="absolute top-3 right-3 text-gray-600 dark:text-gray-200">
              <X size={20}/>
            </button>
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">➕ Add Member</h3>

            {/* Search user */}
            <input
              type="text"
              placeholder="Search by email or name..."
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="max-h-40 overflow-y-auto mb-3">
              {filteredEmails.length > 0 ? (
                filteredEmails.map((user, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 ${selectedUser?.email === user.email ? "bg-gray-300 dark:bg-gray-700" : ""}`}
                  >
                    <img src={user.img} className="w-8 h-8 rounded-full" />
                    <span>{user.name} ({user.email})</span>
                  </div>
                ))
              ) : (
                searchQuery && <p className="text-sm text-gray-500">No results found</p>
              )}
            </div>

            <button
              onClick={() => handleAdd("Member")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg shadow hover:scale-105 transition"
            >
              Add Member
            </button>
          </div>
        </div>
      )}

      {/* Leader Modal */}
      {showLeaderModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-xl shadow-xl w-[90%] max-w-md animate-slide-up relative">
            <button onClick={() => setShowLeaderModal(false)} className="absolute top-3 right-3 text-gray-600 dark:text-gray-200">
              <X size={20}/>
            </button>
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">➕ Add Leader</h3>

            {/* Search user */}
            <input
              type="text"
              placeholder="Search by email or name..."
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="max-h-40 overflow-y-auto mb-3">
              {filteredEmails.length > 0 ? (
                filteredEmails.map((user, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 ${selectedUser?.email === user.email ? "bg-gray-300 dark:bg-gray-700" : ""}`}
                  >
                    <img src={user.img} className="w-8 h-8 rounded-full" />
                    <span>{user.name} ({user.email})</span>
                  </div>
                ))
              ) : (
                searchQuery && <p className="text-sm text-gray-500">No results found</p>
              )}
            </div>

            <button
              onClick={() => handleAdd("Leader")}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg shadow hover:scale-105 transition"
            >
              Add Leader
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
