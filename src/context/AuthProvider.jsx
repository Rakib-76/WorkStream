"use client";
import { useEffect, useState } from "react";
import useAxiosSecure from "../lib/useAxiosSecure";
import { DataContext } from "../context/DataContext";
import { useSession } from "next-auth/react";

const DataProvider = ({ children }) => {
    const { data: session } = useSession();
    const axiosSecure = useAxiosSecure();

    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProjects = async () => {
            if (!session?.user?.email) {
                setProjects([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const res = await axiosSecure.get(`/api/projects?email=${session.user.email}`);
                if (!res.data.success) throw new Error("Failed to fetch projects");

                // Sort by createdAt descending
                const sortedProjects = res.data.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setProjects(sortedProjects);
                setError(null);
            } catch (err) {
                setError(err);
                setProjects([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProjects();
    }, [session?.user?.email]);
    console.log(projects);
    const value = {
        user: session?.user || null,
        projects,
        isLoading,
        error,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
