"use client";
import React, { useContext } from "react";
import { Facebook, Twitter, Linkedin, Dribbble, Globe, X } from "lucide-react";
import { DataContext } from "../../../../context/DataContext";

const ProfileModal = ({ isOpen, onClose }) => {
    const { userData } = useContext(DataContext);
    if (!isOpen) return null;

    const profileData = {
        name: userData?.displayName || "Alex Anderson",
        email: userData?.email || "alex@example.com",
        title: "UI/UX Designer",
        bio: "Creative designer crafting clean, modern, and user-centered digital experiences. Passionate about blending aesthetics and usability.",
        followers: 1200,
        following: 850,
        bannerUrl: "https://placehold.co/800x250/1E40AF/ffffff?text=Blue+Wave+Design",
        avatarUrl:
            userData?.photoURL ||
            "https://placehold.co/128x128/374151/ffffff?text=AA",
        socialLinks: [
            { name: "Facebook", url: "#" },
            { name: "Twitter", url: "#" },
            { name: "LinkedIn", url: "#" },
            { name: "Dribbble", url: "#" },
        ],
    };

    const SocialIconMap = {
        Facebook,
        Twitter,
        LinkedIn: Linkedin,
        Dribbble,
        Globe,
    };

    const SocialLink = ({ Icon, url }) => (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 transition duration-300 mx-2 p-2 rounded-full hover:bg-blue-50"
        >
            <Icon size={20} />
        </a>
    );

    const {
        name,
        email,
        title,
        bio,
        followers,
        following,
        bannerUrl,
        avatarUrl,
        socialLinks,
    } = profileData;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose} // 🔹 Click on backdrop closes modal
        >
            {/* Modal content */}
            <div
                className="relative w-full max-w-lg bg-white shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()} // 🔹 Prevent closing when clicking inside modal
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"
                >
                    <X size={22} />
                </button>

                {/* Banner */}
                <div className="relative">
                    <img
                        src={bannerUrl}
                        alt="Profile Banner"
                        className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="p-1 bg-white rounded-full shadow-lg">
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="w-28 h-28 object-cover rounded-full border-4 border-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="text-center pt-16 pb-6 px-6">
                    <h2 className="text-2xl font-bold text-gray-800 mt-2">{name}</h2>
                    <p className="text-sm text-blue-600 font-medium">{email}</p>
                    <p className="text-sm text-gray-600">{title}</p>

                    <p className="text-gray-500 mt-4 mb-6 text-sm leading-relaxed max-w-xs mx-auto">
                        {bio}
                    </p>

                    <div className="flex justify-center border-t border-b border-gray-200 py-3 mb-6">
                        {socialLinks.map(({ name, url }) => {
                            const IconComponent = SocialIconMap[name];
                            return IconComponent ? (
                                <SocialLink key={name} Icon={IconComponent} url={url} />
                            ) : null;
                        })}
                    </div>

                    <div className="flex justify-center space-x-8">
                        <div>
                            <span className="text-xl font-extrabold text-gray-800">
                                {followers}
                            </span>
                            <span className="block text-xs font-semibold uppercase text-gray-500 tracking-wider">
                                Followers
                            </span>
                        </div>
                        <div>
                            <span className="text-xl font-extrabold text-gray-800">
                                {following}
                            </span>
                            <span className="block text-xs font-semibold uppercase text-gray-500 tracking-wider">
                                Following
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ProfileModal;
