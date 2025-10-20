"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import axios from "axios";

// --- Notification Component ---
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
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <span className="font-medium">{notification.message}</span>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
        <X size={16} />
      </button>
    </div>
  );
};

// --- Inline Editable Department Cell ---
const DepartmentCell = ({ member, handleUpdateField }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(member.department || "N/A");
  const inputRef = useRef(null);

  useEffect(() => { if (isEditing && inputRef.current) inputRef.current.focus(); }, [isEditing]);

  const handleSave = () => {
    const trimmedValue = tempValue.trim() || "N/A";
    handleUpdateField(member.email, "department", trimmedValue);
    setTempValue(trimmedValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") { setTempValue(member.department); setIsEditing(false); }
  };

  return (
    <div className="p-3">
      {isEditing ? (
        <input
          ref={inputRef} type="text" value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave} onKeyDown={handleKeyDown}
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

// --- Gender Badge Selector ---
const GenderBadgeSelector = ({ member, handleUpdateField }) => {
  const options = ["Male", "Female"];
  const getBadgeStyle = (gender) => {
    switch (gender) {
      case "Male": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Female": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <td className="p-3 min-w-[150px] flex flex-wrap gap-2">
      {options.map((gender) => (
        <span
          key={gender}
          onClick={() => handleUpdateField(member.email, "gender", gender)}
          className={`cursor-pointer px-3 py-1 rounded-full text-sm font-semibold transition-all ${member.gender === gender
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

// --- Main Team Component ---
export default function Team({ projectId }) {
  const [team, setTeam] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Fetch tasks & map to team ---
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/tasks?projectId=${projectId}`);
        if (!res?.data?.success) return setLoading(false);

        const tasks = res.data.data;
        const assigneesMap = {};

        tasks.forEach((task) => {
          const { assigneeTo, creatorEmail, title, status } = task;
          const emails = assigneeTo?.length ? assigneeTo : [creatorEmail];

          emails.forEach((email) => {
            const safeEmail = email || creatorEmail || "unknown@example.com";
            if (!assigneesMap[safeEmail]) {
              assigneesMap[safeEmail] = {
                email: safeEmail,
                name: safeEmail.split("@")[0] || "Unknown",
                role: creatorEmail === safeEmail ? "Leader" : "Member",
                img: `https://placehold.co/40x40/94A3B8/FFFFFF?text=${safeEmail[0]?.toUpperCase() || "?"}`,
                department: "N/A",
                gender: "N/A",
                tasks: [],
              };
            }
            assigneesMap[safeEmail].tasks.push({ title, status });
          });
        });

        setTeam(Object.values(assigneesMap));
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectId]);

  // --- Update inline fields ---
  const handleUpdateField = useCallback((email, field, value) => {
    setTeam((prev) => prev.map((m) => (m.email === email ? { ...m, [field]: value } : m)));
    setNotification({ type: "info", message: `${field} for ${email.split("@")[0]} updated!` });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleCloseNotification = () => setNotification(null);

  return (
    <section className="text-gray-800 dark:text-gray-200">
      <Notification notification={notification} onClose={handleCloseNotification} />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Project Team ({team.length} Members)</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin mr-2" /> Loading team...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-3 text-left min-w-[150px]">Member</th>
                <th className="p-3 text-left min-w-[200px]">Email</th>
                <th className="p-3 text-left min-w-[150px]">Tasks</th>
                <th className="p-3 text-left min-w-[150px]">Department</th>
                <th className="p-3 text-left min-w-[100px]">Gender</th>
                <th className="p-3 text-left min-w-[100px]">Status</th>
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
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/94A3B8/FFFFFF?text=?"; }}
                    />
                    <span className="font-medium">{t.name}</span>
                    {t.role === "Leader" && <span className="ml-1 text-yellow-500">⭐</span>}
                  </td>
                  <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{t.email}</td>
                  <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                    {t.tasks.map((task, idx) => (
                      <div key={idx}>
                        <span className="font-semibold">{task.title}</span> 
                      </div>
                    ))}
                  </td>
                  <td className="p-0">
                    <DepartmentCell member={t} handleUpdateField={handleUpdateField} />
                  </td>
                  <GenderBadgeSelector member={t} handleUpdateField={handleUpdateField} />
                  <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                    {t.tasks.map((task, idx) => (
                      <div key={idx}>{task.status}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
