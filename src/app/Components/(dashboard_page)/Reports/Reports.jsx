"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../../../Components/(home_page)/UI/card";
import { Download, Filter } from "lucide-react";

// Dummy Data (others stay static)
const workloadData = [
  { name: "Syed Bayzid", total: 12, completed: 8 },
  { name: "Abu Sufian", total: 8, completed: 6 },
  { name: "Rahim Khan", total: 5, completed: 4 },
  { name: "Fatima Ahmed", total: 10, completed: 7 },
  { name: "Karim Hossain", total: 6, completed: 4 },
];

const overdueTasks = [
  { task: "UI Design", overdue: 5 },
  { task: "Backend API", overdue: 3 },
  { task: "Testing", overdue: 4 },
  { task: "Deployment", overdue: 2 },
  { task: "Docs", overdue: 6 },
];

const projectProgress = [
  { name: "To-do", progress: 80 },
  { name: "In-progress", progress: 60 },
  { name: "Completed", progress: 40 },
  { name: "Pending", progress: 90 },
];

export default function Reports({ projectId }) {
  const [taskCompletionTrend, setTaskCompletionTrend] = useState([]);
  const [taskPendingTrend, setTaskPendingTrend] = useState([]);
  const [loading, setLoading] = useState(false);

  

  // ✅ Fetch project-based task completion trend from API
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    const fetchCompletedTasks = async () => {
      try {
        const res = await fetch(`/api/completed?projectId=${projectId}`);
        const json = await res.json();

        if (json.success) {
          // Transform priority data (High/Medium/Low) to line chart data
          // Example format for LineChart: [{name: "High", completed: 5}, ...]
          const trendData = json.data.map((d) => ({
            name: d.priority,
            completed: d.completed,
          }));
          setTaskCompletionTrend(trendData);
        }
      } catch (error) {
        console.error("Error fetching completed task data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedTasks();
  }, [projectId]);
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    const fetchPendingTasks = async () => {
      try {
        const res = await fetch(`/api/pending?projectId=${projectId}`);
        const json = await res.json();

        if (json.success) {
          // Transform priority data (High/Medium/Low) to line chart data
          // Example format for LineChart: [{name: "High", completed: 5}, ...]
          const trendData = json.data.map((d) => ({
            name: d.priority,
            pending: d.pending,
          }));
         setTaskPendingTrend(trendData);
        }
      } catch (error) {
        console.error("Error fetching completed task data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingTasks();
  }, [projectId]);

  return (
    <div className="space-y-10 px-2 sm:px-4 md:px-6 lg:px-8 py-6 overflow-x-hidden bg-card border border-border rounded-xl  shadow">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-center md:text-left">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg">
            Get a visual overview of your team's performance and workload.
          </p>
        </div>
      </div>

      {/* Top Charts */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Overdue Tasks */}
        {/* ✅ Pending Tasks by Priority */}
<Card className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl 
  bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
  <CardHeader>
    <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
      Pending Tasks by Priority
    </CardTitle>
  </CardHeader>
  <CardContent>
    {loading ? (
      <p className="text-gray-500 text-center">Loading chart...</p>
    ) : (
      <ResponsiveContainer width="100%" minHeight={200} height={250}>
  <AreaChart data={taskPendingTrend}>
    <defs>
      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#4E61D3" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#4E61D3" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
    <XAxis dataKey="name" stroke="#6B7280" tick={{ fontSize: 11 }} />
    <YAxis stroke="#6B7280" tick={{ fontSize: 11 }} />
    <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#fff", borderRadius: "8px" }} />
    <Area
      type="monotone"
      dataKey="pending"
      stroke="#9ECFD4"
      fillOpacity={1}
      fill="url(#colorPending)"
    />
  </AreaChart>
</ResponsiveContainer>

    )}
  </CardContent>
</Card>


        {/* ✅ Dynamic Task Completion Trend */}
        <Card className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              Task Completion Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500 text-center">Loading chart...</p>
            ) : (
              <ResponsiveContainer width="100%" minHeight={200} height={250}>
                <LineChart data={taskCompletionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6B7280" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#fff", borderRadius: "8px" }} />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#06B6D4" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
