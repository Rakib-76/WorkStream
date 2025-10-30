"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

// ====================================================================
//                             COMMON UTILITIES
// ====================================================================

// Utility component for the centered text in the Semi-Donut chart
const TotalAttendanceOverlay = ({ value, label, className = "" }) => (
  <div className={`absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center pb-20 pointer-events-none ${className}`}>
    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

// Utility component for the Total Employees chart legend (to match the image's horizontal style)
const CustomPieLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm mt-4">
    {payload.map((entry, index) => (
      <div key={`item-${index}`} className="flex items-center space-x-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="text-gray-600 dark:text-gray-300">{entry.payload.name}</span>
      </div>
    ))}
  </div>
);

// Custom Tooltip component for better visual style
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Determine the name and value based on the chart type
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

// ====================================================================
//                             CHART DATA
// ====================================================================

// Total Employees (Pie)
const employeeData = [
  { name: "Design", value: 30, color: "#3B82F6" },      // Blue
  { name: "Business", value: 25, color: "#22C55E" },    // Green
  { name: "Development", value: 40, color: "#EAB308" }, // Yellow
  { name: "Testing", value: 35, color: "#F97316" },     // Orange
];

// Attendance Overview (Semi Donut)
const attendanceData = [
  { name: "Present", value: 59, color: "#22C55E" },
  { name: "Late", value: 21, color: "#0EA5E9" },
  { name: "Permission", value: 2, color: "#EAB308" },
  { name: "Absent", value: 15, color: "#EF4444" },
];
const totalAttendance = attendanceData.reduce((sum, item) => sum + item.value, 0);


// Employee Structure (Radial %)
const maleFemaleData = [
  { name: "Male", value: 60, fill: "#F97316", percent: "60%" },  // Orange
  { name: "Female", value: 40, fill: "#A855F7", percent: "40%" }, // Purple
];

// Tasks Statistics Data (Semi-Circular Radial Chart)
const taskStatsChartData = [
  { name: 'Ongoing', value: 40, color: '#22C55E' },    // Green
  { name: 'In Progress', value: 24, color: '#3B82F6' }, // Blue
  { name: 'Overdue', value: 16, color: '#EF4444' },    // Red
  { name: 'On Hold', value: 10, color: '#F97316' },    // Orange
  { name: 'Remaining', value: 10, color: '#0EA5E9' },  // Cyan/Teal
];
const completedTasks = 124;
const totalTasks = 165;
const totalHoursSpent = 389;
const totalHoursBudget = 689;

// Projects Data
const projectData = [
  { id: "PRO-001", name: "Office Management App", team: ["J", "S", "M"], deadline: "12 Sep 2024", priority: "High" },
  { id: "PRO-002", name: "Clinic Management", team: ["K", "B", "R", "+1"], deadline: "24 Oct 2024", priority: "Low" },
  { id: "PRO-003", name: "Educational Platform", team: ["E", "F", "G"], deadline: "18 Feb 2025", priority: "Medium" },
  { id: "PRO-004", name: "Chat & Call Mobile App", team: ["O", "P"], deadline: "19 Feb 2025", priority: "High" },
  { id: "PRO-005", name: "Travel Planning Website", team: ["Q", "R", "S"], deadline: "18 Feb 2025", priority: "Medium" },
  { id: "PRO-006", name: "Service Booking Software", team: ["U", "V", "W"], deadline: "20 Feb 2025", priority: "Low" },
  { id: "PRO-008", name: "Financial Dashboard", team: ["Y", "Z", "+2"], deadline: "17 Oct 2024", priority: "Medium" },
];

// ====================================================================
//                             NEW COMPONENTS
// ====================================================================

// --- Priority Badge ---
const PriorityBadge = ({ priority }) => {
  let colorClass = "";
  switch (priority) {
    case "High":
      colorClass = "bg-red-500 text-white";
      break;
    case "Medium":
      colorClass = "bg-pink-500 text-white";
      break;
    case "Low":
      colorClass = "bg-green-500 text-white";
      break;
    default:
      colorClass = "bg-gray-400 text-white";
  }
  return (
    <span className={`badge badge-sm rounded-lg py-1 px-3 ${colorClass} font-semibold text-xs`}>
      {priority}
    </span>
  );
};

// --- Team Avatar Stack ---
const ProjectAvatarStack = ({ teamMembers }) => {
  // Generate distinct background colors for avatars based on the character
  const getBgColor = (char) => {
    const hash = char.charCodeAt(0) + char.charCodeAt(char.length - 1);
    const colors = ['#FBBF24', '#34D399', '#60A5FA', '#F472B6', '#93C5FD'];
    return colors[hash % colors.length];
  };

  return (
    <div className="flex -space-x-2 rtl:space-x-reverse justify-center md:justify-start">
      {teamMembers.slice(0, 3).map((member, index) => (
        <div
          key={index}
          className="w-7 h-7 rounded-full text-xs text-white flex items-center justify-center ring-2 ring-white dark:ring-[#1E1E2E] font-medium transition-transform hover:scale-110"
          style={{ backgroundColor: getBgColor(member) }}
        >
          {member.startsWith('+') ? member : member.charAt(0)}
        </div>
      ))}
      {teamMembers.length > 3 && (
        <div
          className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-600 text-xs text-gray-800 dark:text-gray-200 flex items-center justify-center ring-2 ring-white dark:ring-[#1E1E2E] font-medium transition-transform hover:scale-110"
        >
          +{teamMembers.length - 3}
        </div>
      )}
    </div>
  );
};

// --- Project Progress Bar ---
const ProjectProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;
  const color = progress > 75 ? 'bg-green-500' : progress > 30 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="flex flex-col space-y-1 w-full min-w-[100px]">
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
        {current}/{total} hrs
      </span>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
};

// --- Projects Table Component ---
const ProjectsTable = () => {
  const headers = ["ID", "Name", "Team", "Deadline", "Priority"];

  // Function to handle the calendar icon click (placeholder)
  const handleCalendarClick = () => {
    console.log("Showing this week's projects");
  };

  return (
    <motion.div
      className="bg-white dark:bg-[#1E1E2E] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl col-span-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-xl font-semibold">Projects</h3>
        <button
          className="btn btn-sm text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center"
          onClick={handleCalendarClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          This Week
        </button>
      </div>

      <div className="overflow-x-auto">
        {/* Use a proper table structure */}
        <table className="table w-full text-sm">
          <thead className="text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            <tr>
              {headers.map(header => (
                <th key={header} className="p-2 border-b dark:border-gray-700 min-w-[70px]">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {projectData.map((project, index) => (
              <motion.tr
                key={project.id}
                className="hover:bg-gray-50 dark:hover:bg-[#252535] transition duration-150"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <td className="p-2 font-mono text-xs text-gray-500 dark:text-gray-400">{project.id}</td>
                <td className="p-2 font-medium text-gray-900 dark:text-gray-100">{project.name}</td>
                <td className="p-2"><ProjectAvatarStack teamMembers={project.team} /></td>
                {/* <td className="p-2"><ProjectProgressBar current={project.hours} total={project.totalHours} /></td> */}
                <td className="p-2 text-gray-600 dark:text-gray-300 min-w-[100px]">{project.deadline}</td>
                <td className="p-2"><PriorityBadge priority={project.priority} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// --- Tasks Statistics Component ---
const TasksStatisticsChart = () => {
  // Total percentage for visualization (sum of values in taskStatsChartData)
  const chartHeight = 250;
  const innerRadius = 90;
  const outerRadius = 130;

  // Function to handle the calendar icon click (placeholder)
  const handleCalendarClick = () => {
    console.log("Showing this week's tasks");
  };

  return (
    <motion.div
      className=" bg-white dark:bg-[#1E1E2E] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl col-span-1 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-xl font-semibold">Tasks Statistics</h3>
        <button
          className="btn btn-sm text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center"
          onClick={handleCalendarClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          This Week
        </button>
      </div>

      {/* Chart Area */}
      <div className="relative flex-grow">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={taskStatsChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={3}
              cornerRadius={15} // Rounded corners
              isAnimationActive

            >
              {taskStatsChartData.map((entry, index) => (
                <Cell key={`task-cell-${index}`} fill={entry.color} stroke={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text Overlay for Tasks */}
        <div className="absolute top-[calc(50%_-_25px)] left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center pb-20 pointer-events-none">
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Total Tasks</p>
          <p className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mt-1">
            {completedTasks}/{totalTasks}
          </p>
        </div>
      </div>

      {/* Task Legend/Percentage Grid */}
      <div className="grid grid-cols-2 gap-4 text-center text-sm mt-4">
        {/* Percentages based on image layout */}
        {[
          { name: "Ongoing", color: taskStatsChartData[0].color, percentage: 40 },
          { name: "On Hold", color: taskStatsChartData[3].color, percentage: 10 },
          { name: "Overdue", color: taskStatsChartData[2].color, percentage: 16 },
          { name: "In Progress", color: taskStatsChartData[1].color, percentage: 24 }
        ].map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="font-bold text-lg" style={{ color: stat.color }}>{stat.percentage}%</span>
            <span className="text-gray-500 dark:text-gray-400">{stat.name}</span>
          </div>
        ))}
      </div>

      {/* Hours Spent Card (Dark Footer) */}
      <motion.div
        className="mt-6 p-4 rounded-xl flex justify-between items-center bg-gray-800 text-white dark:bg-gray-900 dark:text-white"
        whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div>
          <p className="text-3xl font-extrabold">{totalHoursSpent}/{totalHoursBudget} hrs</p>
          <p className="text-sm font-medium opacity-80">Spent on Overall Tasks This Week</p>
        </div>
        <button className="btn btn-sm bg-white text-gray-800 hover:bg-gray-200 border-none rounded-lg font-semibold">
          View All
        </button>
      </motion.div>
    </motion.div>
  );
};


// ====================================================================
//                             MAIN OVERVIEW
// ====================================================================

export default function Overviewchart() {
  return (
    // Added base styling for a clean dark/light mode background
    <div className="space-y-6  min-h-screen  text-gray-800 dark:text-gray-200">

      {/* Title */}
      <h2 className="text-3xl font-bold">Dashboard Overview</h2>

      {/* Welcome Card (Styled for DaisyUI feel) */}
      <motion.div
        className="bg-white dark:bg-[#1E1E2E] border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Here’s a quick snapshot of your{" "}
          <span className="font-semibold text-blue-500 dark:text-blue-400">team performance</span> today.
        </p>
      </motion.div>

      {/* --- First Row: Charts Section (3 Columns on desktop) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ==== 1. Total Employees (Pie Chart with Custom Legend) ==== */}
        <motion.div
          className="bg-white dark:bg-[#1E1E2E] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl flex flex-col items-center"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-xl font-semibold mb-4 w-full">Total Employees</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={employeeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50} // Donut style
                paddingAngle={2}
                fill="#8884d8"
                labelLine={false}
              >
                {employeeData.map((entry, index) => (
                  <Cell key={`emp-cell-${index}`} fill={entry.color} stroke={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <CustomPieLegend payload={employeeData.map(d => ({ color: d.color, payload: d }))} />
        </motion.div>


        {/* ==== 2. Attendance Overview (Semi Donut with Center Text) ==== */}
        <motion.div
          className="bg-white dark:bg-[#1E1E2E] border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl relative"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Attendance Overview</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Today
            </span>
          </div>

          <div className="relative h-[180px]"> {/* fixed height */}
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
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <TotalAttendanceOverlay value={totalAttendance} label="Total Attendance" />
          </div>


          {/* Status and Details Legend (Styled to match the image's layout) */}
          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 className="text-lg font-semibold mb-3">Status</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              {attendanceData.map((entry, index) => (
                <div key={`stat-${index}`} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-gray-600 dark:text-gray-300">{entry.name}</span>
                  </div>
                  {/* Calculation based on totalAttendance */}
                  <span className="font-semibold">{Math.round((entry.value / totalAttendance) * 100)}%</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Absentees</p>
              <div className="flex items-center space-x-2">
                {/* Dummy profile avatars */}
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  <div className="w-6 h-6 rounded-full bg-orange-400 text-xs text-white flex items-center justify-center ring ring-offset-2 dark:ring-offset-[#1E1E2E]">J</div>
                  <div className="w-6 h-6 rounded-full bg-blue-400 text-xs text-white flex items-center justify-center ring ring-offset-2 dark:ring-offset-[#1E1E2E]">S</div>
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-xs text-gray-800 dark:text-gray-200 flex items-center justify-center ring ring-offset-2 dark:ring-offset-[#1E1E2E]">+1</div>
                </div>
                <button className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </motion.div>


        {/* ==== 3. Employee Structure (Vertical Radial Bars) ==== */}
        <motion.div
          className="bg-white dark:bg-[#1E1E2E] border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl flex flex-col justify-center items-center"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-xl font-semibold mb-4 w-full">Employee Structure</h3>

          {/* Vertical alignment for the two rings to match the image */}
          <div className="flex flex-col space-y-8 w-full items-center py-4">

            {/* Male Structure (60%) */}
            <div className="flex flex-col items-center w-full relative">
              <ResponsiveContainer width={150} height={150}>
                <RadialBarChart
                  innerRadius="80%"
                  outerRadius="100%"
                  barSize={15}
                  data={[{ name: "Male", value: 60, fill: maleFemaleData[0].fill }]} // Single data point for single ring
                  startAngle={90}
                  endAngle={-270} // Full circle progress track
                >
                  <RadialBar
                    minAngle={10}
                    background={{ fill: '#fde6d8' }} // Light orange track
                    clockWise
                    dataKey="value"
                    cornerRadius={10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <text
                    x={75}
                    y={75}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: "20px", fontWeight: "bold" }}
                    fill={maleFemaleData[0].fill}
                  >
                    60%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300 -mt-2">Male</span>
            </div>

            {/* Female Structure (40%) */}
            <div className="flex flex-col items-center w-full relative">
              <ResponsiveContainer width={150} height={150}>
                <RadialBarChart
                  innerRadius="80%"
                  outerRadius="100%"
                  barSize={15}
                  data={[{ name: "Female", value: 40, fill: maleFemaleData[1].fill }]} // Single data point for single ring
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    minAngle={10}
                    background={{ fill: '#edd5fe' }} // Light purple track
                    clockWise
                    dataKey="value"
                    cornerRadius={10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <text
                    x={75}
                    y={75}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold"
                    fill={maleFemaleData[1].fill}
                  >
                    40%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300 -mt-2">Female</span>
            </div>

          </div>

        </motion.div>
      </div>

      {/* --- Second Row: Projects & Tasks Section (2 Columns on desktop) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectsTable />
        <TasksStatisticsChart />
      </div>
    </div >
  );
}