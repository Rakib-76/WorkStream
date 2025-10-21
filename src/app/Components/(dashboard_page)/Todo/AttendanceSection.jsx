
// "use client";

// export default function AttendanceSection = ({ task, currentUserEmail }) => {
//   const [attendance, setAttendance] = useState([]);

//   useEffect(() => {
//     if (task.startDate && task.endDate) {
//       const start = dayjs(task.startDate);
//       const end = dayjs(task.endDate);
//       const dates = [];

//       for (let d = start; d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
//         const dayName = d.format("dddd");
//         const isHoliday = dayName === "Friday" || dayName === "Saturday";
//         dates.push({
//           date: d.format("YYYY-MM-DD"),
//           status: isHoliday ? "Holiday" : "Pending",
//         });
//       }

//       setAttendance(dates);
//     }
//   }, [task]);

//   // 🕒 Mark attendance
//   const handleAttendance = (index) => {
//     setAttendance((prev) =>
//       prev.map((item, i) => {
//         if (i !== index) return item;

//         const now = dayjs();
//         const tenAM = dayjs().hour(10).minute(0).second(0);
//         if (now.isAfter(tenAM)) {
//           return { ...item, status: "Late" };
//         } else {
//           return { ...item, status: "Present" };
//         }
//       })
//     );
//   };

//   // ⏰ Auto Absent
//   useEffect(() => {
//     const updated = attendance.map((item) => {
//       if (item.status === "Pending" && dayjs().isAfter(dayjs(item.date), "day")) {
//         return { ...item, status: "Absent" };
//       }
//       return item;
//     });
//     setAttendance(updated);
//   }, [attendance]);

//   // 🎨 Status color helper
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Present":
//         return "bg-green-100 text-green-700";
//       case "Late":
//         return "bg-yellow-100 text-yellow-700";
//       case "Absent":
//         return "bg-red-100 text-red-700";
//       case "Holiday":
//         return "bg-gray-200 text-gray-500";
//       default:
//         return "bg-blue-100 text-blue-700"; // Pending
//     }
//   };

//   return (
//     <div className="space-y-2">
//       {attendance.length === 0 ? (
//         <p className="text-sm text-gray-500">No date range available.</p>
//       ) : (
//         attendance.map((item, index) => (
//           <div
//             key={item.date}
//             className="flex items-center justify-between border rounded-lg px-3 py-2"
//           >
//             <span>{item.date}</span>

//             {item.status === "Holiday" ? (
//               <span
//                 className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}
//               >
//                 Holiday
//               </span>
//             ) : (
//               <button
//                 onClick={() => handleAttendance(index)}
//                 disabled={
//                   !task.assigneeTo?.includes(currentUserEmail) ||
//                   item.status === "Present" ||
//                   item.status === "Late" ||
//                   item.status === "Absent"
//                 }
//                 className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}
//               >
//                 {item.status}
//               </button>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };
