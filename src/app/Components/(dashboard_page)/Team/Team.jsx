"use client";
import { useState, useCallback, useEffect, useRef, useContext } from "react";
import { X, Loader2, Plus } from "lucide-react";
import axios from "axios";
import { DataContext } from "../../../../context/DataContext";
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

// ----------------------------------------------------------------------
// --- 2. Add Member Modal ---
// ----------------------------------------------------------------------
const AddMemberModal = ({ onClose, projectId, onMemberAdded, setNotification }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // --- Fetch all users for suggestions ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users"); // assumes you have /api/users route
        setSuggestions(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch user suggestions:", err);
      }
    };
    fetchUsers();
  }, []);

  const filteredSuggestions = suggestions.filter((u) =>
    u.email.toLowerCase().includes(email.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/members/add-member", {
        projectId,
        memberEmail: email,
      });

      if (res.data.success) {
        setNotification({ type: "success", message: res.data.message });
        onMemberAdded(); // refresh Team table
        onClose();
      } else {
        setNotification({ type: "error", message: res.data.message });
      }
    } catch (err) {
      console.error("Add member failed:", err);
      setNotification({ type: "error", message: "Server error adding member" });
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Member Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-gray-200"
            placeholder="member@example.com"
          />

          {/* Email Suggestions */}
          {email && filteredSuggestions.length > 0 && (
            <div className="border mt-1 rounded-md bg-white dark:bg-gray-800 max-h-32 overflow-y-auto shadow-lg">
              {filteredSuggestions.map((user) => (
                <div
                  key={user.email}
                  className="px-3 py-2 hover:bg-pink-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setEmail(user.email)}
                >
                  {user.email}
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="mt-4 w-full flex justify-center items-center px-4 py-2 rounded-md text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Add Member"}
          </button>
        </form>
      </div>
    </div>
  );
};


// ----------------------------------------------------------------------
// --- 3. Main Team Component ---
// ----------------------------------------------------------------------
export default function Team({ projectId }) {
  const [team, setTeam] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const { manager } = useContext(DataContext);
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "Unknown Email";

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Fetch tasks and map team
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
        const emails = assigneeTo?.length ? assigneeTo : [creatorEmail];

        emails.forEach((email) => {
          const safeEmail = email || creatorEmail || "unknown@example.com";
          if (!assigneesMap[safeEmail]) {
            assigneesMap[safeEmail] = {
              email: safeEmail,
              name: safeEmail.split("@")[0] || "Unknown",
              role: creatorEmail === safeEmail ? "Leader" : "Member",
              img: `https://placehold.co/40x40/94A3B8/FFFFFF?text=${safeEmail[0]?.toUpperCase() || "?"}`,
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

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCloseNotification = () => setNotification(null);

  return (
    <section className="text-gray-800 dark:text-gray-200">
      <Notification notification={notification} onClose={handleCloseNotification} />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Project Team ({team.length} Members)</h2>

        {/* Add Member Button */}
        {
  manager === userEmail && (
    <button
      onClick={() => setIsAddMemberModalOpen(true)} // <-- missing before
      className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors shadow-lg"
      title="Add New Team Member"
    >
      <Plus size={24} />
    </button>
  )
}

      </div>

      {/* Add Member Modal */}
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
                <th className="p-3 text-left min-w-[150px] hidden md:table-cell">Tasks</th>
                <th className="p-3 text-left min-w-[100px] hidden md:table-cell">Status</th>
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
                      className="w-8 h-8 hidden md:block lg:block rounded-full object-cover ring-2 ring-pink-500/50"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/40x40/94A3B8/FFFFFF?text=?";
                      }}
                    />
                    <span className="lg:font-medium">{capitalize(t.name)}</span>
                    {t.role === "Leader" && (
                      <span className="ml-1 text-yellow-500" title="Manager">
                        ⭐
                      </span>
                    )}
                  </td>
                  <td className="p-3 lg:text-sm text-gray-600 dark:text-gray-400">{t.email}</td>
                  <td className="p-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                    {t.tasks.map((task, idx) => (
                      <div key={idx}>
                        <span className="font-semibold">{task.title}</span>
                      </div>
                    ))}
                  </td>
                  <td className="p-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
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
