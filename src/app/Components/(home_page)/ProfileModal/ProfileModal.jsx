"use client";
import React, { useContext } from "react";
import { DataContext } from "../../../../context/DataContext";
import { X, Facebook, Twitter, Linkedin, Dribbble, Globe } from "lucide-react";

const ProfileModal = () => {
    const { userData } = useContext(DataContext);
    console.log(userData);

    const profileData = {
        name: userData?.name || "Unknown Person",
        email: userData?.email || "no@email.com",
        title: "",
        bio: userData?.bio || "This user hasn't added a bio yet.",
        followers: 1200,
        following: 850,
        bannerUrl: "./profileBanner.jpg",
        image:
            userData?.image ||
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
        bannerUrl,
        image,
        socialLinks,
    } = profileData;

    return (
        <dialog id="profile_modal" className="modal">
            <div className="modal-box max-w-lg bg-white rounded-xl shadow-2xl p-0 overflow-hidden">
                {/* Close button */}
                <form method="dialog" className="absolute flex flex-col gap-3 right-3 top-3 z-50">
                    <button className="btn btn-sm btn-circle btn-ghost text-black bg-white/70 hover:bg-white">
                        <X size={18} />
                    </button>
                    {/* Edit Button */}
                    <button
                        className="btn btn-sm btn-circle btn-ghost text-blue-600 bg-white/70 hover:bg-white"
                        onClick={() => console.log("Edit clicked")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.232 5.232l3.536 3.536M4 20h4l10.607-10.607a1.5 1.5 0 00-2.121-2.121L6 17.879V20z"
                            />
                        </svg>
                    </button>
                </form>


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
                                src={image}
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
                </div>
            </div>
        </dialog>
    );
};

export default ProfileModal;
