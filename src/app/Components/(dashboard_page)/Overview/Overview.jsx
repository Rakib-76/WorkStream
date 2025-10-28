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

/* ---------------- Tooltip Component ---------------- */
const WeeklyTaskTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-sm">
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between mb-1 gap-2"
          >
            <span className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700 dark:text-gray-300">
                {entry.name}
              </span>
            </span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/* ---------------- Skeleton Components ---------------- */
const BarChartSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4 h-[350px]">
    <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    <div className="flex justify-around items-end h-48 pt-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col items-center h-full w-8">
          <div
            className="w-full bg-gray-300 dark:bg-gray-600 rounded-t-lg"
            style={{ height: `${Math.random() * 80 + 20}%` }}
          ></div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 mt-2"></div>
        </div>
      ))}
    </div>
  </div>
);

const AreaChartSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4 h-[320px]">
    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    <div className="h-48 w-full bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
  </div>
);

const PieChartSkeleton = () => (
  <div className="animate-pulse flex flex-col justify-center items-center h-[220px]">
    <div className="relative w-40 h-40 rounded-full bg-gray-300 dark:bg-gray-600">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="h-6 w-12 bg-gray-400 dark:bg-gray-500 rounded-md mb-1"></div>
        <div className="h-3 w-16 bg-gray-400 dark:bg-gray-500 rounded-md"></div>
      </div>
    </div>
    <div className="flex space-x-4 mt-4">
      <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  </div>
);

/* ---------------- Overview Component ---------------- */
export default function Overview({ projectId }) {
  const [workloadData, setWorkloadData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  const [loadingWorkload, setLoadingWorkload] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  /* ----------- Fetch Attendance Data ----------- */
  useEffect(() => {
    if (!projectId) return;
    const fetchAttendanceData = async () => {
      setLoadingAttendance(true);
      try {
        const res = await fetch(`/api/attendance?projectId=${projectId}`);
        const data = await res.json();

        if (data.success) {
          const counts = {
            Present: 0,
            Late: 0,
            Permission: 0,
            Pending: 0,
          };

          data.data.forEach((task) => {
            if (Array.isArray(task.attendance)) {
              task.attendance.forEach((entry) => {
                const status = entry.status || "Pending";
                if (counts[status] !== undefined) counts[status]++;
              });
            } else {
              counts.Pending++;
            }
          });

          const formatted = Object.entries(counts)
            .filter(([_, v]) => v > 0)
            .map(([name, value]) => ({
              name,
              value,
              color:
                name === "Present"
                  ? "#10B981"
                  : name === "Late"
                  ? "#3B82F6"
                  : name === "Permission"
                  ? "#FACC15"
                  : "#EF4444",
            }));

          setAttendanceData(formatted);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoadingAttendance(false);
      }
    };
    fetchAttendanceData();
  }, [projectId]);

  /* ----------- Fetch Workload Data ----------- */
  useEffect(() => {
    if (!projectId) return;
    const fetchWorkload = async () => {
      setLoadingWorkload(true);
      try {
        const res = await fetch(`/api/workloadteam?projectId=${projectId}`);
        const json = await res.json();
        if (json.success) setWorkloadData(json.data);
      } catch (err) {
        console.error("Error fetching workload data:", err);
      } finally {
        setLoadingWorkload(false);
      }
    };
    fetchWorkload();
  }, [projectId]);

  /* ----------- Fetch Task Data ----------- */
  useEffect(() => {
    if (!projectId) return;
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const res = await fetch(`/api/tasks?projectId=${projectId}`);
        const json = await res.json();
        if (json.success) setTaskData(json.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, [projectId]);

  /* ----------- Weekly Task Chart Data ----------- */
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
      if (weeklyData[weekLabel][status] !== undefined)
        weeklyData[weekLabel][status]++;
    });
    return Object.values(weeklyData);
  }

  const totalAttendance = attendanceData.reduce((a, b) => a + b.value, 0);

  /* ---------------- UI Layout ---------------- */
  return (
    <div className="space-y-6 min-h-screen text-gray-800 dark:text-gray-200">
      <h2 className="text-3xl font-bold">Dashboard Overview</h2>

      {/* Welcome Section */}
      <motion.div
        className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Here’s a quick snapshot of your{" "}
          <span className="font-semibold text-blue-500 dark:text-blue-400">
            team performance
          </span>{" "}
          today.
        </p>
      </motion.div>

      {/* Team Workload Chart */}
      <div className="p-6 bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Team Workload Distribution</h2>
        {loadingWorkload ? (
          <BarChartSkeleton />
        ) : workloadData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workloadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={(v) => v.split("@")[0]}
                tick={{ fontSize: 12, angle: -25, textAnchor: "end" }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip content={<WeeklyTaskTooltip />} />
              <Legend />
              <Bar
                dataKey="total"
                fill="#6366F1"
                name="Total Tasks"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="completed"
                fill="#10B981"
                name="Completed Tasks"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <span className="text-4xl mb-2">📭</span>
            <p>No task data available yet</p>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Task Trend */}
        <motion.div
          className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl flex flex-col"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-xl font-semibold mb-4">Weekly Task Trend</h3>
          {loadingTasks ? (
            <AreaChartSkeleton />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 20, right: 30 }}>
                <defs>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorInProgress"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorCompleted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
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
              No weekly task data found
            </div>
          )}
        </motion.div>

        {/* Attendance Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl relative"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Attendance Overview</h3>
          </div>

          {loadingAttendance ? (
            <PieChartSkeleton />
          ) : attendanceData.length > 0 ? (
            <div className="relative h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    cornerRadius={6}
                    labelLine={false}
                    isAnimationActive
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Info */}
              <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {totalAttendance}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Total Entries
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <span className="text-3xl mb-2">📊</span>
              <p>No attendance data found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
