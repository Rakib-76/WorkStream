"use client";
import React from "react";
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

// Dummy Data
const workloadData = [
  { name: "Syed Bayzid", total: 12, completed: 8 },
  { name: "Abu Sufian", total: 8, completed: 6 },
  { name: "Rahim Khan", total: 5, completed: 4 },
  { name: "Fatima Ahmed", total: 10, completed: 7 },
  { name: "Karim Hossain", total: 6, completed: 4 },
];

const taskCompletionTrend = [
  { day: "Mon", completed: 5 },
  { day: "Tue", completed: 8 },
  { day: "Wed", completed: 4 },
  { day: "Thu", completed: 7 },
  { day: "Fri", completed: 10 },
  { day: "Sat", completed: 6 },
  { day: "Sun", completed: 9 },
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

export default function Reports() {
  return (
    <div className="space-y-10 px-2 sm:px-4 md:px-6 lg:px-8 py-6 overflow-x-hidden">
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

        {/* Export & Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full">
          <button className="flex items-center gap-2 px-2 sm:px-3 md:px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition text-xs sm:text-sm font-medium">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-2 sm:px-3 md:px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-xs sm:text-sm font-medium">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Top Charts */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Overdue Tasks */}
        <Card className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              Top 5 Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" minHeight={200} height={250}>
              <AreaChart data={overdueTasks}>
                <defs>
                  <linearGradient id="colorOverdue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#476EAE" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#476EAE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="task" stroke="#6B7280" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="overdue"
                  stroke="#476EAE"
                  fillOpacity={1}
                  fill="url(#colorOverdue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Completion Trend */}
        <Card className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              Task Completion Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" minHeight={200} height={250}>
              <LineChart data={taskCompletionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Workload Distribution */}
      <Card className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl 
        bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
            Team Workload Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" minHeight={220} height={300}>
            <BarChart data={workloadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                tick={{ fontSize: 10 }}
                interval={0}
                height={60}
              />
              <YAxis stroke="#6B7280" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  color: "#fff",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="total" fill="#6366F1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="completed" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Performance */}
      <Card className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl 
        bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
            Project Performance Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projectProgress.map((p, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs sm:text-sm md:text-base font-medium mb-1 text-gray-700 dark:text-gray-300">
                <span>{p.name}</span>
                <span>{p.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
                <div
                  className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
