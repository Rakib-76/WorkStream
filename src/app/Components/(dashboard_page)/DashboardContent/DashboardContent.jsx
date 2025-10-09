"use client";

import CalendarSection from "../../Calender/CalenderSection";
import Attendence from "../Attendence/Attendence";
import Chat from "../Chat/Chat";
import Overview from "../Overview/Overview";
import Reports from "../Reports/Reports";
import Tasks from "../Tasks/Tasks";
import Team from "../Team/Team";
import Todo from "../Todo/Todo";

export default function DashboardContent({ activeItem, selectedProject  }) {
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

  const renderContent = () => {
    switch (activeItem) {
      case "overview":
        return (
          <div>
            <Overview />
          </div>
        );

      case "tasks":
        return (
          <div>
            <Tasks></Tasks>
          </div>
        );
      case "attendence":
        return (
          <div>
            <Attendence></Attendence>
          </div>
        );

      case "calendar":
        return (
          <div className="p-6 bg-card border border-border rounded-xl shadow">
            <CalendarSection />
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
          <div className="p-6 bg-card border border-border rounded-xl shadow">
            <Chat></Chat>
          </div>
        );

      case "callmeet":
        return (
          <div className="p-6 bg-card border border-border rounded-xl shadow">
            <h3 className="text-lg font-bold">📞 Call / Meet</h3>
            <p className="text-muted-foreground mt-2">
              Video/voice meeting integration section.
            </p>
          </div>
        );

      case "team":
        return (
          <div>
            <Team></Team>
          </div>
        );

      case "notes":
        return (
          <div className="p-6 bg-card border border-border rounded-xl shadow">
            <h3 className="text-lg font-bold">📝 Notes</h3>
            <p className="text-muted-foreground mt-2">
              Save your important notes here.
            </p>
          </div>
        );

      case "reports":
        return (
          <div className="p-6 bg-card border border-border rounded-xl  shadow">
            <Reports></Reports>
          </div>
        );

    }
  };

  return <div className="animate-fadeIn">
    {renderContent()}</div>;
}
