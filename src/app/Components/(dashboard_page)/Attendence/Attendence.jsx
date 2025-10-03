"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../Components/(home_page)/UI/card";
import { Badge } from "../../../Components/(home_page)/UI/badge";

// ✅ Dummy attendance data
const attendanceRecords = [
  { id: 1, name: "John Doe", date: "2025-10-15", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "Present" },
  { id: 2, name: "Jane Smith", date: "2025-10-15", checkIn: "09:15 AM", checkOut: "05:45 PM", status: "Present" },
  { id: 3, name: "Mike Johnson", date: "2025-10-15", checkIn: "09:05 AM", checkOut: "05:20 PM", status: "Present" },
  { id: 4, name: "Sarah Williams", date: "2025-10-15", checkIn: "-", checkOut: "-", status: "Absent" },
  { id: 5, name: "Emily Brown", date: "2025-10-15", checkIn: "10:00 AM", checkOut: "04:00 PM", status: "Half Day" },
];

// ✅ Function to return Badge variant based on status
const getStatusVariant = (status) => {
  switch (status) {
    case "Present":
      return "default"; // Blue
    case "Absent":
      return "destructive"; // Red
    case "Half Day":
      return "secondary"; // Gray
    default:
      return "outline";
  }
};

export default function Attendance() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Attendance</h1>
        <p className="text-gray-500 dark:text-gray-400">Track team attendance and working hours</p>
      </div>

      {/* Attendance Table */}
      <Card className="glass-card shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase tracking-wide text-xs md:text-sm">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Check In</th>
                  <th className="p-3 text-left">Check Out</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, idx) => (
                  <tr
                    key={record.id}
                    className={`transition-all duration-200 ${
                      idx % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800"
                    } hover:bg-blue-50 dark:hover:bg-blue-900`}
                  >
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">{record.name}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{record.date}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{record.checkIn}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{record.checkOut}</td>
                    <td className="p-3">
                      <Badge variant={getStatusVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
