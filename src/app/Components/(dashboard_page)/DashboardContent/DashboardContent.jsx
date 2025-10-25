"use client";

import { useContext } from "react";
import CalendarSection from "../../Calender/CalenderSection";
import ChatSection from "../../Chat/ChatSection";
import Attendence from "../Attendence/Attendence";
import Overview from "../Overview/Overview";
import Reports from "../Reports/Reports";
import Tasks from "../Tasks/Tasks";
import Team from "../Team/Team";
import Todo from "../Todo/Todo";
import Videoconference from "../Videoconference/Videoconference";
import { DataContext } from "../../../../context/DataContext";

export default function DashboardContent({ activeItem }) {

  const { selectedProject } = useContext(DataContext);

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <h2 className="text-lg font-bold">No Project Selected</h2>
        <p className="text-muted-foreground mt-2">
          Please select a project to view data.
        </p>
      </div>
    );
  }
  const projectId = selectedProject?._id;

  const renderContent = () => {
    switch (activeItem) {
      case "overview":
        return (
          <div className="">
            <Overview />
          </div>
        );

      case "tasks":
        return (
          <div className="">
            <Tasks projectId={projectId}></Tasks>
          </div>
        );
      case "attendence":
        return (
          <div className="">
            <Attendence></Attendence>
          </div>
        );

      case "calendar":
        return (
          <div className="p-6 bg-card border border-border rounded-xl shadow ">
            <CalendarSection projectId={projectId} />
          </div>
        );

      case "todo":
        return (
          <div className="">
            <Todo></Todo>
          </div>
        );

      case "chat":
        return (
          <div className="p-6 bg-card border border-border rounded-xl shadow ">
            <ChatSection />
          </div>
        );

      case "callmeet":
        return (
          <div className="p-6 bg-card border border-border rounded-xl shadow ">
            <Videoconference></Videoconference>
          </div>
        );

      case "team":
        return (
          <div className="">
            <Team projectId={projectId}></Team>
          </div>
        );

      case "notes":
        return (
          <div className="p-6 bg-card border border-border rounded-xl shadow ">
            <h3 className="text-lg font-bold">📝 Notes</h3>
            <p className="text-muted-foreground mt-2">
              Save your important notes here.
            </p>
          </div>
        );

      case "reports":
        return (
          <div className="p-6 bg-card border border-border rounded-xl  shadow ">
            <Reports projectId={projectId}></Reports>
          </div>
        );

    }
  };

  return <div className="animate-fadeIn">
    {renderContent()}</div>;
}
