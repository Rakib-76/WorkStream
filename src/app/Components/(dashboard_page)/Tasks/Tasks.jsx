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
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";


export default function Tasks({ projectId }) {
  const [activeTab, setActiveTab] = useState("all");
  const { data: session } = useSession();
  const axiosSecure = useAxiosSecure();
  const userEmail = session?.user?.email;
  const [isCreatedByUser, setIsCreatedByUser] = useState(false);
  const [loading, setLoading] = useState(true);


  // Fetch all tasks
  const { data: tasksData = [], refetch, isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      if (!projectId) {
        return [];
      }
      setLoading(true);
      const res = await axiosSecure.get(`/api/tasks?projectId=${projectId}`);
      return res.data.data;
    },
    enabled: !!projectId,
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

  // only creator see task my task fetch
  if (isLoading) {
    return <LoadingSpinner />
  }

  const displayedTasks =
    activeTab === "all"
      ? tasksData
      : tasksData.filter((task) =>
        task?.assigneeTo?.some(email => email === userEmail)
      );


  return (
    <div className="space-y-6 ">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 pt-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted-foreground ">
          <button
            className={`px-4 py-2 rounded-t ${activeTab === "my" ? "bg-background font-semibold" : ""}`}
            onClick={() => setActiveTab("my")}
          >
            My Tasks
          </button>
          <button
            className={`px-4 py-2 rounded-t ${activeTab === "all" ? "bg-background font-semibold" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Tasks
          </button>
        </div>
      </div>

      {/* Tasks Table */}
      <TaskTable tasks={displayedTasks}
        getPriorityColor={getPriorityColor}
        getStatusColor={getStatusColor}
      />

    </div>
  );
}

//  Table component
function TaskTable({ tasks, getPriorityColor, getStatusColor }) {
  return (
    <Card className="glass-card shadow-lg border border-gray-200 dark:border-gray-700">

      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full border-collapse md:min-w-[700px]">
          <thead className="bg-gray-100 dark:bg-gray-800">
  <tr>
    <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wider">
      Task Title
    </th>
    <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wider hidden md:table-cell">
      Assigned To
    </th>
    <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wider hidden md:table-cell">
      Deadline
    </th>
    <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wider">
      Priority
    </th>
    <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wider hidden md:table-cell">
      Status
    </th>
  </tr>
</thead>

<tbody>
  {tasks.map((task) => (
    <tr
      key={task._id}
      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
    >
      <td className="p-3 font-medium">{task.title}</td>

      <td className="p-3 hidden md:table-cell">
        {task?.assigneeTo?.length > 0
          ? task.assigneeTo.join(" , ")
          : "No Assignee"}
      </td>

      <td className="p-3 hidden md:table-cell">{task.endDate}</td>

      <td>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </td>

      <td className="hidden md:table-cell">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </CardContent>
    </Card>
  );
}

