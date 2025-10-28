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
          <div className="md:pt-12 pt-6 lg:pt-0">
            <Overview projectId={projectId}/>
          </div>
        );

      case "tasks":
        return (
          <div className="md:pt-12 pt-12 lg:pt-0">
            <Tasks projectId={projectId}></Tasks>
          </div>
        );
      case "attendence":
        return (
          <div className="md:pt-12 pt-12 lg:pt-0">
            <Attendence projectId={projectId}></Attendence>
            {/* <Attendence></Attendence> */}
          </div>
        );

      case "calendar":
        return (
          <div className="md:pt-14 lg:pt-0 pt-14   ">
            <CalendarSection projectId={projectId} />
          </div>
        );

      case "todo":
        return (
          <div className="md:pt-14 pt-14 lg:pt-0 ">
            <Todo></Todo>
          </div>
        );

      case "chat":
        return (
          <div className="md:pt-14 pt-14 lg:pt-0  ">
            <ChatSection />
          </div>
        );

      case "callmeet":
        return (
          <div className="md:pt-14 pt-14 lg:pt-0 ">
            <Videoconference></Videoconference>
          </div>
        );

      case "team":
        return (
          <div className="lg:pt-0 md:pt-12 pt-12">
            <Team projectId={projectId}></Team>
          </div>
        );

      // case "notes":
      //   return (
      //     <div className="md:pt-12 p-6 bg-card border border-border rounded-xl shadow ">
      //       <h3 className="text-lg font-bold">📝 Notes</h3>
      //       <p className="text-muted-foreground mt-2">
      //         Save your important notes here.
      //       </p>
      //     </div>
      //   );

      case "reports":
        return (
          <div className="md:pt-14 pt-14 lg:pt-0    ">
            <Reports projectId={projectId}></Reports>
          </div>
        );

    }
  };

  return <div className="animate-fadeIn">
    {renderContent()}</div>;
}
