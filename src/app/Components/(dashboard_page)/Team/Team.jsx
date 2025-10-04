"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";

// --- Custom Notification Component ---
const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const colorClass =
    notification.type === "success"
      ? "bg-green-500"
      : notification.type === "info"
      ? "bg-blue-500"
      : "bg-yellow-500";

  return (
    <div
      className={`fixed top-4 right-4 z-[100] p-4 rounded-lg shadow-2xl text-white flex items-center space-x-3 transform transition-all duration-300 ${colorClass}`}
      style={{ animation: "slideIn 0.3s ease-out" }}
    >
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <span className="font-medium">{notification.message}</span>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
        <X size={16} />
      </button>
    </div>
  );
};

// ---- Fake Initial Data (Updated with Department and Gender) ----
const fakeEmails = [
  {
    email: "alex@example.com",
    name: "Alex Carter",
    img: "https://placehold.co/40x40/FF5733/FFFFFF?text=AC",
    company: "BrightWave Innovations",
    department: "Engineering",
    gender: "Male",
  },
  {
    email: "julia@example.com",
    name: "Julia Roberts",
    img: "https://placehold.co/40x40/33FF57/FFFFFF?text=JR",
    company: "Stellar Dynamics",
    department: "Marketing",
    gender: "Female",
  },
  {
    email: "daniel@example.com",
    name: "Daniel White",
    img: "https://placehold.co/40x40/5733FF/FFFFFF?text=DW",
    company: "Quantum Nexus",
    department: "Design",
    gender: "Male",
  },
  {
    email: "maria@example.com",
    name: "Maria Sanchez",
    img: "https://placehold.co/40x40/FF33A1/FFFFFF?text=MS",
    company: "BrightWave Innovations",
    department: "HR",
    gender: "Female",
  },
  {
    email: "chris@example.com",
    name: "Chris Lee",
    img: "https://placehold.co/40x40/33A1FF/FFFFFF?text=CL",
    company: "Quantum Nexus",
    department: "Sales",
    gender: "Male",
  },
];

// --- Custom Components for Table Cells ---

// 1. Inline Editable Department Cell
const DepartmentCell = ({ member, handleUpdateField }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(member.department);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedValue = tempValue.trim() || "N/A";
    handleUpdateField(member.email, "department", trimmedValue);
    setTempValue(trimmedValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
      setTempValue(member.department);
      setIsEditing(false);
    }
  };

  return (
    <div className="p-3">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-sm border-2 border-pink-500 focus:outline-none"
          placeholder="Enter Department"
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className="cursor-pointer hover:text-pink-500 transition duration-150 p-1 block min-w-[100px]"
          title="Click to edit department"
        >
          {member.department || "N/A"}
        </span>
      )}
    </div>
  );
};

// 2. Gender Badge Selector (No dropdown)
const GenderBadgeSelector = ({ member, handleUpdateField }) => {
  const options = ["Male", "Female"];

  const getBadgeStyle = (gender) => {
    switch (gender) {
      case "Male":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Female":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <td className="p-3 min-w-[150px] flex flex-wrap gap-2">
      {options.map((gender) => (
        <span
          key={gender}
          onClick={() => handleUpdateField(member.email, "gender", gender)}
          className={`cursor-pointer px-3 py-1 rounded-full text-sm font-semibold transition-all ${
            member.gender === gender
              ? "scale-105 shadow-lg border-2 border-pink-500"
              : "hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700"
          } ${getBadgeStyle(gender)}`}
        >
          {gender}
        </span>
      ))}
    </td>
  );
};

export default function Team() {
  const [team, setTeam] = useState([
    {
      name: "Alex Carter",
      email: "alex@example.com",
      role: "Leader",
      company: "BrightWave Innovations",
      img: fakeEmails[0].img,
      department: "Engineering",
      gender: "Male",
    },
    {
      name: "Julia Roberts",
      email: "julia@example.com",
      role: "Member",
      company: "Stellar Dynamics",
      img: fakeEmails[1].img,
      department: "Marketing",
      gender: "Female",
    },
  ]);

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState(null);

  // Function to handle field updates (department, gender)
  const handleUpdateField = useCallback((email, field, value) => {
    setTeam((prevTeam) =>
      prevTeam.map((member) =>
        member.email === email ? { ...member, [field]: value } : member
      )
    );
    setNotification({
      type: "info",
      message: `${field} for ${email.split("@")[0]} updated successfully!`,
    });
    setTimeout(() => setNotification(null), 3000);
  }, []);

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
      // Find default department/gender from fakeEmails or use default
      const defaults =
        fakeEmails.find((f) => f.email === selectedUser.email) || {
          department: "N/A",
          gender: "N/A",
        };

      setTeam([
        ...team,
        {
          ...selectedUser,
          role,
          department: defaults.department,
          gender: defaults.gender,
        },
      ]);
      setShowMemberModal(false);
      setShowLeaderModal(false);
      setSearchQuery("");
      setSelectedUser(null);
      setNotification({
        type: "success",
        message: `✅ ${selectedUser.name} added as ${role} successfully!`,
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCloseNotification = () => setNotification(null);

  return (
    <section className="p-4 md:p-8 text-gray-800 dark:text-gray-200">
      <Notification notification={notification} onClose={handleCloseNotification} />

      {/* Header + Add Member Btn */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Team Details
        </h2>
        <div className="relative group inline-block">
          <button
            onClick={() => setShowMemberModal(true)}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition duration-200"
          >
            <Plus size={18} className="inline mr-1" /> Add Member
          </button>
          <span className="absolute right-0 top-full mt-2 scale-0 group-hover:scale-100 transition duration-300 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100">
            Invite New Team Member
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="mb-8 space-y-2 bg-gradient-to-r from-pink-50/70 to-red-50/70 dark:from-gray-800/70 dark:to-gray-900/70 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          <b>Project:</b> Office Management App
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          <b>Company:</b> BrightWave Innovations
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center gap-2 relative">
          <b>Leader:</b> {team.find((t) => t.role === "Leader")?.name || "N/A"}
          {/* plus icon with tooltip */}
          <div className="relative group">
            <button
              onClick={() => setShowLeaderModal(true)}
              className="ml-2 bg-green-500 hover:bg-green-600 text-white p-1 rounded-full shadow transition hover:scale-110 active:scale-95"
            >
              <Plus size={16} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 scale-0 group-hover:scale-100 transition duration-300 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100">
              Assign Leader
            </span>
          </div>
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <table className="w-full border-collapse overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-3 text-left min-w-[150px]">Member</th>
              <th className="p-3 text-left min-w-[200px]">Email</th>
              <th className="p-3 text-left min-w-[150px]">Company</th>
              <th className="p-3 text-left min-w-[120px]">Position</th>
              <th className="p-3 text-left min-w-[150px]">Department</th>
              <th className="p-3 text-left min-w-[150px]">Gender</th>
            </tr>
          </thead>
          <tbody>
            {team.map((t, i) => (
              <tr
                key={i}
                className="bg-white dark:bg-[#1E1E2E] border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
              >
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={t.img}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-500/50"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/40x40/94A3B8/FFFFFF?text=?";
                    }}
                  />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {t.name}
                  </span>
                  {t.role === "Leader" && (
                    <span className="ml-1 text-yellow-500 transition transform hover:scale-150">
                      ⭐
                    </span>
                  )}
                </td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                  {t.email}
                </td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                  {t.company}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      t.role === "Leader"
                        ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                        : "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
                    }`}
                  >
                    {t.role}
                  </span>
                </td>
                {/* Department Cell */}
                <td className="p-0">
                  <DepartmentCell member={t} handleUpdateField={handleUpdateField} />
                </td>
                {/* Gender Badges */}
                <GenderBadgeSelector member={t} handleUpdateField={handleUpdateField} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-[90%] max-w-md animate-fade-in relative transition-all duration-300">
            <button
              onClick={() => setShowMemberModal(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-200 hover:text-red-500 transition"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              ➕ Add New Member
            </h3>

            {/* Search user */}
            <input
              type="text"
              placeholder="Search by email or name..."
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-pink-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="max-h-40 overflow-y-auto mb-4 border rounded-lg border-gray-200 dark:border-gray-700">
              {filteredEmails.length > 0 ? (
                filteredEmails.map((user, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
                      selectedUser?.email === user.email
                        ? "bg-pink-100 dark:bg-pink-900/50 border-l-4 border-pink-500"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <img
                      src={user.img}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/40x40/94A3B8/FFFFFF?text=?";
                      }}
                    />
                    <div className="flex flex-col text-sm">
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {user.email}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                searchQuery && (
                  <p className="text-sm text-gray-500 p-3">
                    No new user matching "{searchQuery}" found.
                  </p>
                )
              )}
            </div>

            <button
              onClick={() => handleAdd("Member")}
              disabled={!selectedUser}
              className={`w-full py-2 rounded-lg shadow-md transition duration-200 font-semibold ${
                selectedUser
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-[1.01] active:scale-95"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Add Member
            </button>
          </div>
        </div>
      )}

      {/* Leader Modal (Identical logic, different action) */}
      {showLeaderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-[90%] max-w-md animate-fade-in relative transition-all duration-300">
            <button
              onClick={() => setShowLeaderModal(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-200 hover:text-red-500 transition"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              ➕ Assign New Leader
            </h3>

            {/* Search user */}
            <input
              type="text"
              placeholder="Search by email or name..."
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="max-h-40 overflow-y-auto mb-4 border rounded-lg border-gray-200 dark:border-gray-700">
              {filteredEmails.length > 0 ? (
                filteredEmails.map((user, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
                      selectedUser?.email === user.email
                        ? "bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <img
                      src={user.img}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/40x40/94A3B8/FFFFFF?text=?";
                      }}
                    />
                    <div className="flex flex-col text-sm">
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {user.email}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                searchQuery && (
                  <p className="text-sm text-gray-500 p-3">
                    No user matching "{searchQuery}" found.
                  </p>
                )
              )}
            </div>

            <button
              onClick={() => handleAdd("Leader")}
              disabled={!selectedUser}
              className={`w-full py-2 rounded-lg shadow-md transition duration-200 font-semibold ${
                selectedUser
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-[1.01] active:scale-95"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Assign Leader
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
