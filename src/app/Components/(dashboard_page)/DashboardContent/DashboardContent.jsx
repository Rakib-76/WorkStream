"use client";

import Overview from "../Overview/Overview";
import Team from "../Team/Team";

export default function DashboardContent({ activeItem }) {
  const renderContent = () => {
    switch (activeItem) {
      case "overview":
        return (
          <div>
            <Overview />
          </div>
        );

      case "mytask":
        return (
          <ul className="list-disc pl-6 space-y-2">
            <li>Design landing page</li>
            <li>Fix navigation bugs</li>
            <li>Submit assignment</li>
          </ul>
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
          <div className="p-6 bg-card border border-border rounded-xl shadow">
            <h3 className="text-lg font-bold">✅ To-do</h3>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Complete homework</li>
              <li>Prepare presentation</li>
              <li>Read project docs</li>
            </ul>
          </div>
        );

      case "chat":
        return (
          <div className="p-6 bg-card border border-border rounded-xl shadow">
            <h3 className="text-lg font-bold">💬 Chat</h3>
            <p className="text-muted-foreground mt-2">
              Messaging interface will go here.
            </p>
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
