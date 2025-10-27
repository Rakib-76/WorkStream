"use client";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "framer-motion";
import { startOfWeek, format } from "date-fns";

// --- Utility Components ---
const WeeklyTaskTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-sm">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 justify-between mb-1">
            <span className="flex items-center space-x-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700 dark:text-gray-300">{entry.name}</span>
            </span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TotalAttendanceOverlay = ({ value, label, className = "" }) => (
  <div
    className={`absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center pb-20 pointer-events-none ${className}`}
  >
    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0].payload.name ? payload[0].payload : payload[0];
    return (
      <div className="p-2 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl text-sm backdrop-blur-sm">
        <p className="font-bold text-gray-900 dark:text-gray-100">{dataItem.name}</p>
        <p className="text-gray-700 dark:text-gray-300">Value: {dataItem.value}</p>
      </div>
    );
  }
  return null;
};

// --- Sample Data (for Pie & Attendance) ---
const attendanceData = [
  { name: "Present", value: 59, color: "#22C55E" },
  { name: "Late", value: 21, color: "#0EA5E9" },
  { name: "Permission", value: 2, color: "#EAB308" },
  { name: "Absent", value: 15, color: "#EF4444" },
];
const totalAttendance = attendanceData.reduce((sum, item) => sum + item.value, 0);

// --- Overview Component ---
export default function Overview({ projectId }) {
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Fetch workload data
  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/workloadteam?projectId=${projectId}`);
        const json = await res.json();
        if (json.success) setWorkloadData(json.data);
      } catch (error) {
        console.error("Error fetching workload data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // Fetch task data for weekly chart
  useEffect(() => {
    if (!projectId) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/tasks?projectId=${projectId}`);
        const json = await res.json();
        if (json.success) setTaskData(json.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [projectId]);

  // Process tasks into weekly summary
  useEffect(() => {
    if (taskData.length > 0) {
      const weeklyStats = getWeeklyTaskStats(taskData);
      setChartData(weeklyStats);
    }
  }, [taskData]);

  function getWeeklyTaskStats(tasks) {
    const weeklyData = {};
    tasks.forEach((task) => {
      const created = new Date(task.createdAt);
      const weekStart = startOfWeek(created, { weekStartsOn: 0 });
      const weekLabel = format(weekStart, "MMM d");

      if (!weeklyData[weekLabel]) {
        weeklyData[weekLabel] = {
          week: weekLabel,
          Pending: 0,
          "In Progress": 0,
          Completed: 0,
        };
      }

      const status = task.status || "Pending";
      if (weeklyData[weekLabel][status] !== undefined) {
        weeklyData[weekLabel][status] += 1;
      }
    });

    return Object.values(weeklyData);
  }

  return (
    <div className="space-y-6 min-h-screen text-gray-800 dark:text-gray-200">
      <h2 className="text-3xl font-bold">Dashboard Overview</h2>

      <motion.div
        className="bg-white dark:bg-[#1E1E2E] border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Here’s a quick snapshot of your{" "}
          <span className="font-semibold text-blue-500 dark:text-blue-400">team performance</span>{" "}
          today.
        </p>
      </motion.div>

      {/* Team Workload Chart */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Team Workload Distribution</h2>
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="h-6 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            ))}
            <motion.div
              className="h-48 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
        ) : workloadData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workloadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={(value) => value.split("@")[0]}
                tick={{ fontSize: 12, angle: -25, textAnchor: "end" }}
              />
              <YAxis />
             <Tooltip content={<WeeklyTaskTooltip />} />
              <Legend />
              <Bar dataKey="total" fill="#6366F1" name="Total Tasks" radius={[6, 6, 0, 0]} />
              <Bar dataKey="completed" fill="#10B981" name="Completed Tasks" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-4xl mb-2"
            >
              📭
            </motion.div>
            <p className="text-sm">No task data available yet</p>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* === Weekly Task Trend (Updated to Stacked Area Chart) === */}
        <motion.div
          className="bg-white dark:bg-[#1E1E2E] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl flex flex-col"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-xl font-semibold mb-4">Weekly Task Trend</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis allowDecimals={false} />
               <Tooltip content={<WeeklyTaskTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Area
                  type="monotone"
                  dataKey="Pending"
                  stackId="1"
                  stroke="#fbbf24"
                  fill="url(#colorPending)"
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="In Progress"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="url(#colorInProgress)"
                />
                <Area
                  type="monotone"
                  dataKey="Completed"
                  stackId="1"
                  stroke="#22c55e"
                  fill="url(#colorCompleted)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-48 text-gray-500">
              Loading chart data...
            </div>
          )}
        </motion.div>

        {/* === Attendance Overview === */}
        <motion.div
          className="bg-white dark:bg-[#1E1E2E] border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl relative"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Attendance Overview</h3>
          </div>

          <div className="relative h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                  cornerRadius={10}
                  isAnimationActive={true}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`att-cell-${index}`} fill={entry.color} stroke={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <TotalAttendanceOverlay value={totalAttendance} label="Total Attendance" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
