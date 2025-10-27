"use client";
import { useState, useEffect } from "react";
import { DataContext } from "./DataContext";
import { useSession } from "next-auth/react";
import useAxiosSecure from "../lib/useAxiosSecure";

const DataProvider = ({ children }) => {
    const { data: session, status } = useSession();
    const axiosSecure = useAxiosSecure();
    const [selectedProject, setSelectedProject] = useState(null);
    const manager = selectedProject?.manager?.email;

    // 🔹 Load from localStorage when app loads
    useEffect(() => {
        const saved = localStorage.getItem("selectedProject");
        if (saved) {
            try {
                setSelectedProject(JSON.parse(saved));
            } catch {
                localStorage.removeItem("selectedProject");
            }
        }
    }, []);
    // 🔹 Save to localStorage whenever it changes
    useEffect(() => {
        if (selectedProject) {
            localStorage.setItem("selectedProject", JSON.stringify(selectedProject));
        } else {
            localStorage.removeItem("selectedProject");
        }
    }, [selectedProject]);

    const value = {
        session,
        axiosSecure,
        selectedProject,
        setSelectedProject,
        manager,
    };
return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
