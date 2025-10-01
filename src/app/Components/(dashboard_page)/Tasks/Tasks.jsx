"use client";
import { useState } from "react";
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../Components/(home_page)/UI/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../Components/(home_page)/UI/dropdown-menu";
import { toast } from "sonner";

// ✅ Dummy tasks
const initialTasks = [
  { id: 1, title: "Design Landing Page", priority: "High", status: "In Progress", assignedTo: "Abid", deadline: "2025-10-10" },
  { id: 2, title: "Set up Database", priority: "Medium", status: "Pending", assignedTo: "Bayzid", deadline: "2025-10-15" },
  { id: 3, title: "Deploy Project", priority: "Low", status: "Completed", assignedTo: "Abid", deadline: "2025-10-20" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState("all");
  const currentUser = "Abid"; // dynamically change if needed

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
    ? tasks
    : tasks.filter((task) => task.assignedTo === currentUser);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted-foreground ">
        <button
          className={`px-4 py-2 rounded-t ${activeTab === "all" ? "bg-background font-semibold" : "bg-muted/20"}`}
          onClick={() => setActiveTab("all")}
        >
          All Tasks
        </button>
        <button
          className={`px-4 py-2 rounded-t ${activeTab === "my" ? "bg-background font-semibold" : "bg-muted/20"}`}
          onClick={() => setActiveTab("my")}
        >
          My Tasks
        </button>
      </div>

      {/* Tasks Table */}
      <TaskTable tasks={displayedTasks} getPriorityColor={getPriorityColor} getStatusColor={getStatusColor} />
    </div>
  );
}

// ✅ Table component
function TaskTable({ tasks, getPriorityColor, getStatusColor }) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Task Title</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Status</th>
              <th className="p-2">Assigned To</th>
              <th className="p-2">Deadline</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="border-b">
                  <td className="p-2 font-medium">{task.title}</td>
                  <td className={`p-2 border rounded ${getPriorityColor(task.priority)}`}>{task.priority}</td>
                  <td className={`p-2 border rounded ${getStatusColor(task.status)}`}>{task.status}</td>
                  <td className="p-2">{task.assignedTo}</td>
                  <td className="p-2">{task.deadline}</td>
                  <td className="p-2 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-muted rounded">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast("Edit clicked")}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast("Delete clicked")} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
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
