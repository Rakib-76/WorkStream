"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { X, Loader2, Plus } from "lucide-react"; // Plus icon যোগ করা হয়েছে
import axios from "axios";
import { DataContext } from "../../../../context/DataContext";
import { useContext } from "react";
import { useSession } from "next-auth/react";

// ----------------------------------------------------------------------
// --- 1. Notification Component ---
// ----------------------------------------------------------------------
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
      <style jsx global>{` @keyframes slideIn {
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

// ----------------------------------------------------------------------
// --- 2. Inline Editable Department Cell ---
// ----------------------------------------------------------------------
const DepartmentCell = ({ member, handleUpdateField }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(member.department || "N/A");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const handleSave = () => {
    const trimmedValue = tempValue.trim() || "N/A";
    handleUpdateField(member.email, "department", trimmedValue);
    setTempValue(trimmedValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
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

// ----------------------------------------------------------------------
// --- 3. Gender Badge Selector ---
// ----------------------------------------------------------------------
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

// ----------------------------------------------------------------------
// --- 4. Add Member Modal Component (NEW) ---
// ----------------------------------------------------------------------
const AddMemberModal = ({ onClose, projectId, onMemberAdded, setNotification }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const memberEmail = email.trim();
    if (!memberEmail) return;

    setLoading(true);

    // NOTE: এই API কলটি ব্যাকএন্ডে গিয়ে নতুন মেম্বারকে প্রজেক্টে যোগ করার জন্য
    // একটি নতুন টাস্ক বা কেবল মেম্বারশিপ ডকুমেন্ট তৈরি করবে।
    try {
      // এই API endpoint এবং payload আপনার ব্যাকএন্ডের সাথে মানানসই হতে হবে।
      const response = await axios.post("/api/members/add-member", {
        projectId,
        memberEmail,
      });

      if (response.status === 200 || response.status === 201) {
        setNotification({ type: "success", message: `Member ${memberEmail.split("@")[0]} added to project.` });
        onMemberAdded(); // টিম লিস্ট রিফ্রেশ করা
        onClose();
      } else {
        throw new Error(response.data.message || "Failed to add member.");
      }
    } catch (err) {
      console.error("Add Member Error:", err);
      setNotification({ type: "error", message: err.response?.data?.message || "Failed to add member. Check console." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-[#1E1E2E] rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700">
          <h3 className="text-xl font-bold dark:text-gray-200">Add New Member</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X size={20} className="dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="member-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Member Email Address
            </label>
            <input
              type="email"
              id="member-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-gray-200"
              placeholder="member@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Add Member"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// --- 5. Main Team Component ---
// ----------------------------------------------------------------------
export default function Team({ projectId }) {
  const [team, setTeam] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false); // New state for Modal
  const { manager } = useContext(DataContext);
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "Unknown Email";

  // --- Fetch tasks & map to team (wrapped in useCallback) ---
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/tasks?projectId=${projectId}`);
      if (!res?.data?.success) {
        setLoading(false);
        return;
      }

      const tasks = res.data.data;
      const assigneesMap = {};

      tasks.forEach((task) => {
        const { assigneeTo, creatorEmail, title, status } = task;
        // Assignee-to যদি না থাকে, creator-কে assignee ধরা হচ্ছে।
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
      setNotification({ type: "error", message: "Failed to load team data." });
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // --- Initial data fetch ---
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- Update inline fields ---
  const handleUpdateField = useCallback((email, field, value) => {
    setTeam((prev) => prev.map((m) => (m.email === email ? { ...m, [field]: value } : m)));
    setNotification({ type: "info", message: `${field} for ${email.split("@")[0]} updated locally!` });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleCloseNotification = () => setNotification(null);

  return (
    <section className="text-gray-800 dark:text-gray-200">
      <Notification notification={notification} onClose={handleCloseNotification} />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Project Team ({team.length} Members)</h2>
        {/* Add Member Button */}
        {
          manager === userEmail &&
          (
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors shadow-lg"
              title="Add New Team Member"
            >
              <Plus size={24} />
            </button>
          )
        }

      </div>

      {/* Add Member Modal RENDER */}
      {isAddMemberModalOpen && (
        <AddMemberModal
          onClose={() => setIsAddMemberModalOpen(false)}
          projectId={projectId}
          onMemberAdded={fetchTasks}
          setNotification={setNotification}
        />
      )}

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