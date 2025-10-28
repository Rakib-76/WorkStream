"use client";
import React, { useContext } from "react";
import { DataContext } from "../../../../context/DataContext";
import { X, Facebook, Twitter, Linkedin, Dribbble, Globe } from "lucide-react";

const ProfileModal = () => {
    const { userData } = useContext(DataContext);

    if (!userData) return null;

    const {
        name,
        email,
        bio,
        phone,
        website,
        location,
        image,
        bannerUrl,
        membership,
    } = userData;

    const socialLinks = [
        { name: "Facebook", url: "#" },
        { name: "Twitter", url: "#" },
        { name: "LinkedIn", url: "#" },
        { name: "Dribbble", url: "#" },
    ];

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

    return (
        <dialog id="profile_modal" className="modal">
            <div className="modal-box max-w-lg bg-white rounded-xl shadow-2xl p-0 overflow-hidden">
                {/* Close & Edit Buttons */}
                <form method="dialog" className="absolute flex flex-col gap-3 right-3 top-3 z-50">
                    <button className="btn btn-sm btn-circle btn-ghost text-black bg-white/70 hover:bg-white">
                        <X size={18} />
                    </button>
                </form>

                {/* Banner */}
                <div className="relative">
                    <img
                        src={bannerUrl || "/profileBanner.jpg"}
                        alt="Profile Banner"
                        className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="p-1 bg-white rounded-full shadow-lg">
                            <img
                                src={image || "https://placehold.co/128x128/374151/ffffff?text=AA"}
                                alt="Avatar"
                                className="w-28 h-28 object-cover rounded-full border-4 border-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="text-center pt-16 pb-6 px-6 max-h-[400px] overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mt-2">{name}</h2>
                    <p className="text-sm text-blue-600 font-medium">{email}</p>
                    {membership && (
                        <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                            {membership.charAt(0).toUpperCase() + membership.slice(1)} Member
                        </span>
                    )}

                    {bio && (
                        <p className="text-gray-500 mt-4 mb-6 text-sm leading-relaxed">
                            {bio}
                        </p>
                    )}

                    <div className="flex flex-col items-center gap-2 text-gray-600 mb-6">
                        {location && (
                            <p className="text-sm flex items-center gap-1">
                                <Globe size={16} /> {location}
                            </p>
                        )}
                        {phone && <p className="text-sm">📞 {phone}</p>}
                        {website && (
                            <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                🌐 {website}
                            </a>
                        )}
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center border-t border-b border-gray-200 py-3">
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
