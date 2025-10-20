"use client";
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import useAxiosSecure from "../../../../lib/useAxiosSecure";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

export default function NotificationBell({ selectedProjectId, userEmail }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const axiosSecure = useAxiosSecure();

    // Fetch notifications when selectedProjectId changes
    useEffect(() => {
        if (!selectedProjectId) return;

        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const res = await axiosSecure.get(`/api/notifications?projectId=${selectedProjectId}`);
                if (res?.data?.success) setNotifications(res?.data?.notifications);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [selectedProjectId, axiosSecure]);

    const markAsRead = async (id) => {
        console.log("Marking as read:", id);
        // try {
        //     const res = await axiosSecure.patch(`/api/notifications/${id}/read`);
        //     if (res.data.success) {
        //         setNotifications(prev =>
        //             prev.map(n => (n._id === id ? { ...n, read: true } : n))
        //         );
        //     }
        // } catch (err) {
        //     console.error(err);
        // }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                {notifications.some(n => !n.read) && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
                )}
            </button>

            {openDropdown && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
                    {loading ? (
                        <LoadingSpinner />
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                    ) : (
                        <div className="overflow-y-auto max-h-96">
                            {notifications.map(n => (
                                <div
                                    key={n._id}
                                    onClick={() => markAsRead(n._id)}
                                    className={`p-3 border-b last:border-none cursor-pointer transition-colors ${n.read ? "bg-gray-100 dark:bg-gray-700" : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        }`}
                                >
                                    <p className="text-sm text-gray-800 dark:text-gray-100">{n.message}</p>
                                    <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
