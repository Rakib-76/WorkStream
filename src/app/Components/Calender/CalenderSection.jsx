"use client";


import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";


export default function CalendarSection({ projectId }) {
    console.log(projectId)
    const [events, setEvents] = useState([]);
    const calendarRef = useRef(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`/api/calenderTask?projectId=${projectId}`);
                const result = await response.json(); // API Response


                // array nischit hoyar jonno
                if (result.success && Array.isArray(result.data)) {
                    const tasks = result.data;
                    //   Task array


                    // Map the tasks into a calendar event format.


                    const formattedEvents = tasks.map(task => {


                        const startDateTime = task.startDate; // যেমন: "2025-10-16"
                        const endDateTime = task.endDate;   // যেমন: "2025-10-23"


                        return {
                            title: task.title + ' (' + task.priority + ')', // show title and priority
                            start: new Date(startDateTime), // event starting date
                            end: new Date(endDateTime),     // event ending date
                            allDay: true,
                            resource: task, // full task
                        };
                    });


                    setEvents(formattedEvents);
                } else {
                    console.error("API returned an error or data is not an array:", result);
                    setEvents([]);
                }
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            }
        };


        fetchTasks();
    }, [projectId]);



    async function handleDateClick(info) {
        const title = prompt("Event title:");
        if (!title) return;
        const payload = { title, start: info.dateStr, allDay: info.allDay };
        try {
            const res = await axios.post("/api/tasks", payload, { headers: { "Content-Type": "application/json" } });
            const ev = res.data;
            setEvents((prev) => [...prev, { id: ev.id, title: ev.title, start: ev.start, end: ev.end }]);
        } catch (err) {
            console.error(err);
            alert("Failed to create event");
        }
    }


    async function handleEventClick(clickInfo) {
        const ev = clickInfo.event;
        const action = prompt("Type 'delete' to remove or enter new title to update:", ev.title);
        if (!action) return;
        if (action.toLowerCase() === "delete") {
            try {
                await axios.delete(`/api/tasks?id=${ev.id}`);
                ev.remove();
                setEvents((prev) => prev.filter((e) => e.id !== ev.id));
            } catch (err) {
                console.error(err);
                alert("Failed to delete");
            }
            return;
        }
        // update title
        try {
            const res = await axios.patch("/api/tasks", { id: ev.id, title: action });
            ev.setProp("title", res.data.title);
            setEvents((prev) => prev.map((e) => (e.id === ev.id ? { ...e, title: res.data.title } : e)));
        } catch (err) {
            console.error(err);
            alert("Failed to update");
        }
    }


    async function handleEventDrop(dropInfo) {
        const ev = dropInfo.event;
        try {
            const payload = { id: ev.id, start: ev.start?.toISOString(), end: ev.end?.toISOString(), allDay: ev.allDay };
            const res = await axios.patch("/api/tasks", payload);
            // update local
            setEvents((prev) => prev.map((e) => (e.id === ev.id ? { ...e, start: res.data.start, end: res.data.end } : e)));
        } catch (err) {
            console.error(err);
            alert("Failed to reschedule event");
            dropInfo.revert();
        }
    }


    return (
        <div className="p-4 glass-card shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">📅 Project Calendar</h3>
                <div>
                    <button className="btn btn-sm">
                        Refresh
                    </button>
                </div>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
                    selectable={true}
                    editable={true}
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    eventDrop={handleEventDrop}
                    height={650}
                />
            )}
        </div>
    );
}