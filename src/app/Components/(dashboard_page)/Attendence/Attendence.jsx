"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../(home_page)/UI/card";

export default function AttendancePage({ projectId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ API theke attendance data load
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/attendance?projectId=${projectId}`);
        const json = await res.json();
        if (json.success) {
          setRecords(json.data);
        }
      } catch (err) {
        console.log("Error loading attendance:", err);
      } finally {
        setLoading(false);
      }
    }
    if (projectId) load();
  }, [projectId]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className=" space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Attendance</h1>
        <p className="text-gray-500">Track team attendance and working hours</p>
      </div>

      <Card className="glass-card shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        {/* <CardHeader>
          <CardTitle className="text-lg md:text-xl">Tasks Attendance</CardTitle>
        </CardHeader> */}

        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase tracking-wide text-xs md:text-sm">
                  <th className="p-3 text-left">Task Title</th>
                  <th className="p-3 text-left">Creator Email</th>
                  <th className="p-3 text-left">Start Date</th>
                  <th className="p-3 text-left">Attendance</th>
                </tr>
              </thead>

              <tbody>
                {records.map((item, idx) => (
                  <tr
                    key={item._id}
                    className={`transition-all duration-200 ${idx % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800"
                      } hover:bg-blue-50 dark:hover:bg-blue-900`}
                  >
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </td>

                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {item.creatorEmail}
                    </td>

                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {item.startDate}
                    </td>

                    <td className="p-3 space-y-1">
                      {Array.isArray(item.attendance) && item.attendance.length > 0 ? (
                        item.attendance.map((a, i) => (
                          <span
                            key={i}
                            className={`block w-fit px-2 py-1 rounded text-xs ${a.status === "present"
                                ? "bg-green-500 text-white"
                                : a.status === "absent"
                                  ? "bg-red-500 text-white"
                                  : "bg-yellow-500 text-white"
                              }`}
                          >
                            {a.status}
                          </span>
                        ))
                      ) : (
                        <span className="bg-gray-400 text-white px-2 py-1 rounded text-xs">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {records.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
