"use client";
import { useState, useEffect } from "react";
import { DataContext } from "./DataContext";
import { useSession } from "next-auth/react";
import useAxiosSecure from "../lib/useAxiosSecure";

const DataProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const userEmail = session?.user?.email;
    const axiosSecure = useAxiosSecure();
    // 🧩 selectedProject state
    const [selectedProject, setSelectedProject] = useState(null);

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
    // user fine by email 
    useEffect(() => {
        if (!loading && userEmail) {
            axiosSecure
                .get(`/api/users?email=${userEmail}`)
                .then((res) => setUser(res.data))
                .catch((err) => console.error(err));
        }
    }, [userEmail]);

    const value = {
        session,
        axiosSecure,
        selectedProject,
        setSelectedProject,
        user,
    };
return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
