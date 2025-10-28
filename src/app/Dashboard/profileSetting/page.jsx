"use client";
import React, { useState, useEffect, useContext } from "react";
import { Pencil, ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditProfileForm from "./components/EditProfileForm";
import ProfileInfo from "./components/ProfileInfo";
import ProfileHeader from "./components/ProfileHeader";
import { DataContext } from "../../../context/DataContext";

export default function ProfileSetting() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const { userData } = useContext(DataContext);

    // ✅ Fetch user data
    useEffect(() => {
        if (!userData?.email) return;
        const fetchUser = async () => {
            const res = await fetch(`/api/user?email=${userData.email}`);
            const data = await res.json();
            setProfileData(data);
        };
        fetchUser();
    }, [userData]);

    // ✅ Update handler
    const handleSave = async (data) => {
        const res = await fetch("/api/user", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, email: userData.email }),
        });

        const result = await res.json();
        if (res.ok) {
            setProfileData(data);
            setIsEditing(false);
            alert("✅ Profile updated successfully!");
        } else {
            alert(`❌ ${result.error || "Failed to update"}`);
        }
    };

    if (!profileData) {
        return <div className="text-center py-10">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="border px-4 py-2 inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white"
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
