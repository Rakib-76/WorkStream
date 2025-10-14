"use client";
import { useEffect, useState } from "react";
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../Components/(home_page)/UI/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../Components/(home_page)/UI/dropdown-menu";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import useAxiosSecure from "../../../../lib/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import AddTaskFormModal from "../AddTaskFormModal/AddTaskFormModal";
// ✅ Dummy tasks
const initialTasks = [
  { id: 1, title: "Design Landing Page", priority: "High", status: "In Progress", assignedTo: "Abid", deadline: "2025-10-10" },
  { id: 2, title: "Set up Database", priority: "Medium", status: "Pending", assignedTo: "Bayzid", deadline: "2025-10-15" },
  { id: 3, title: "Deploy Project", priority: "Low", status: "Completed", assignedTo: "Abid", deadline: "2025-10-20" },
];

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState("all");
  const { data: session } = useSession();
  const axiosSecure = useAxiosSecure();
  const userEmail = session?.user?.email;
  const [isCreatedByUser, setIsCreatedByUser] = useState(false);

  // ✅ Fetch all projects
  const { data: projects = [], isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/projects");
      return res.data;
    },
  });

  // ✅ Check if the user is the creator of any project
  useEffect(() => {
    if (projects?.data?.length && userEmail) {
      const found = projects?.data?.some(project => project.createdBy === userEmail);
      setIsCreatedByUser(found);
    }
  }, [projects, userEmail]);

  // ✅ Fetch all tasks
    const { data: tasksData = [], refetch } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/tasks");
            return res.data.data;
        },
    });



  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "Low": return "bg-green-500/20 text-green-400 border-green-500/50";
      default: return "bg-muted/20 text-muted-foreground border-muted/50";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "In Progress": return "bg-primary/20 text-primary border-primary/50";
      case "Pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default: return "bg-muted/20 text-muted-foreground border-muted/50";
    }
  };

  const displayedTasks = activeTab === "all"
    ? tasksData
    : tasksData.filter((task) => task.assignedTo === userEmail);

  return (
    <div className="space-y-3 py-16">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 pt-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted-foreground ">
            <button
              className={`px-4 py-2 rounded-t ${activeTab === "all" ? "bg-background font-semibold" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              My Tasks
            </button>
            <button
              className={`px-4 py-2 rounded-t ${activeTab === "my" ? "bg-background font-semibold" : ""}`}
              onClick={() => setActiveTab("my")}
            >
              All Tasks
            </button>
          </div>
        </div>
        {
          isCreatedByUser && (
            <div>
              <button
                className="ml-auto flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          )
        }
      </div>

      {/* Tasks Table */}
      <TaskTable tasks={displayedTasks} getPriorityColor={getPriorityColor} getStatusColor={getStatusColor} />
      <AddTaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={null}
        onTaskAdded={refetch}
      />
    </div>
  );
}

// ✅ Table component
function TaskTable({ tasks, getPriorityColor, getStatusColor }) {
  return (
    <Card className="glass-card shadow-lg border border-gray-200 dark:border-gray-700">

      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {["Task Title", "Priority", "Status", "Assigned To", "Deadline", "Actions"].map((th) => (
                <th
                  key={th}
                  className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wider"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  <td className="p-3 font-medium">{task.title}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="p-3">{task.assignedTo}</td>
                  <td className="p-3">{task.deadline}</td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="shadow-xl border rounded-lg">
                        <DropdownMenuItem
                          onClick={() => toast("Edit clicked")}
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toast("Delete clicked")}
                          className="flex items-center gap-2 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

