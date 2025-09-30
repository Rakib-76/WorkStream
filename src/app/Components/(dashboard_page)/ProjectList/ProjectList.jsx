"use client";
import { useEffect, useState } from "react";

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.data);
        }
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="p-4 rounded-xl shadow bg-slate-800 text-white"
          >
            <h3 className="font-semibold text-lg">{project.projectName}</h3>
            <p className="text-sm text-gray-300">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
