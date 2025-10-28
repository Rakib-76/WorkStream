import React from "react";
import { MapPin, Mail, Calendar } from "lucide-react";

export default function ProfileHeader({
    name,
    email,
    image,
    location,
    joinedDate,
    role = "Member",
}) {
    const initials = name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div className="relative">
            <div className="h-32 w-full rounded-t-xl bg-gradient-to-r from-blue-600 to-blue-400" />
            <div className="px-6 pb-6">
                <div className="relative -mt-16 mb-4">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    ) : (
                        <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                            {initials}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
                        <span className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
                            {role}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-gray-500">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{email}</span>
                        </div>
                        {location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm">{location}</span>
                            </div>
                        )}
                        {joinedDate && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm">Joined {joinedDate}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
