"use client";

import Attendence from "../Attendence/Attendence";
import Chat from "../Chat/Chat";
import Overview from "../Overview/Overview";
import Tasks from "../Tasks/Tasks";
import Team from "../Team/Team";
import Todo from "../Todo/Todo";

export default function DashboardContent({ activeItem }) {
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
            <h3 className="text-lg font-bold">📅 Calendar</h3>
            <p className="text-muted-foreground mt-2">
              Here will be your upcoming events and schedules.
            </p>
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

      case "call meet":
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

      case "ideas":
        return (
          <div className="p-6 bg-card border border-border rounded-xl shadow">
            <h3 className="text-lg font-bold">💡 Sharing Ideas</h3>
            <p className="text-muted-foreground mt-2">
              Post and discuss innovative ideas with your team.
            </p>
          </div>
        );

    }
  };

  return <div className="animate-fadeIn">
    {renderContent()}</div>;
}
