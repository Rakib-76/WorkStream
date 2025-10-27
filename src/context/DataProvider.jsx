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
    const userEmail = session?.user?.email;
    const [userData, setUserData] = useState(null)

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
    useEffect(() => {
        if (!userEmail) return; 

        const fetchUserData = async () => {
            try {
                const res = await axiosSecure.get(`/api/users?email=${userEmail}`);
                setUserData(res.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUserData();
    }, [userEmail, axiosSecure]);

    const value = {
        session,
        axiosSecure,
        selectedProject,
        setSelectedProject,
        manager,
        userData,
        setUserData,
    };
    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
