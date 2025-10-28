import React from "react";

export default function ProfileInfo({ bio, website, phone }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">About</h2>

            {bio ? (
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                    <p className="text-gray-700">{bio}</p>
                </div>
            ) : (
                <p className="text-gray-400 italic">This user hasn't added a bio yet.</p>
            )}

            {website && (
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Website</h3>
                    <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {website}
                    </a>
                </div>
            )}

            {phone && (
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                    <p className="text-gray-700">{phone}</p>
                </div>
            )}
        </div>
    );
}
