"use client";
import React, { useState, useContext, useEffect } from "react";
import { Pencil, ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditProfileForm from "./components/EditProfileForm";
import ProfileInfo from "./components/ProfileInfo";
import ProfileHeader from "./components/ProfileHeader";
import { DataContext } from "../../../context/DataContext";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner"
import useAxiosSecure from "../../../lib/useAxiosSecure";

export default function ProfileSetting() {
    const [isEditing, setIsEditing] = useState(false);
    const { userData } = useContext(DataContext);
    const [profileData, setProfileData] = useState(null);
const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (userData) {
            setProfileData({
                name: userData?.name || "Unknown User",
                email: userData?.email || "no@email.com",
                image: userData?.image || "",
                bannerUrl: userData?.bannerUrl || "./profileBanner.jpg",
                location: userData?.location || "",
                website: userData?.website || "",
                phone: userData?.phone || "",
                bio: userData?.bio || "This user hasn’t added a bio yet.",
                joinedDate: new Date(userData?.createdAt).toLocaleDateString(),
                role: userData?.membership || "Basic Member",
            });
        }
    }, [userData]);

    const handleSave = async (data) => {
        try {
            const res = await axiosSecure.put(
                `/api/users?email=${userData.email}`,
                data
            );

            if (res.data.success) {
                setProfileData(res.data.updatedUser);
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } else {
                toast.error(res.data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error occurred.");
        }
    };

    if (!profileData)
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                <LoadingSpinner />
            </div>
        );

    return (
        <div className="min-h-screen">
            <Toaster position="top-center" />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link
                        href="/"
                        className=" px-4 py-2 inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <ProfileHeader {...profileData} />
                        {!isEditing && (
                            <div className="px-6 pb-6">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg flex items-center gap-2 hover:opacity-90"
                                >
                                    <Pencil className="h-4 w-4" /> Edit Profile
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <EditProfileForm
                            initialData={profileData}
                            onSave={handleSave}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <ProfileInfo {...profileData} />
                    )}
                </div>
            </div>
        </div>
    );
}
