"use client";
import { useState, useEffect } from "react";
import { DataContext } from "./DataContext";
import { useSession } from "next-auth/react";
import useAxiosSecure from "../lib/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const DataProvider = ({ children }) => {
    const { data: session, status } = useSession();
    const axiosSecure = useAxiosSecure();
    const [selectedProject, setSelectedProject] = useState(null);
    const manager = selectedProject?.manager?.email;
    const userEmail = session?.user?.email;
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
    // query by email (React Query)
    const {
        data: userData,
        isLoading: isUserLoading,
        isError,
        refetch: refetchUser,
    } = useQuery({
        queryKey: ["userData", userEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/users?email=${userEmail}`);
            return res.data;
        },
        enabled: !!userEmail && status === "authenticated", // only run when email ready
    });

    const value = {
        session,
        axiosSecure,
        selectedProject,
        setSelectedProject,
        userData,
        manager,
        refetchUser,
        isUserLoading,
    };
    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
