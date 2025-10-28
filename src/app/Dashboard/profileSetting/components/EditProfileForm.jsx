import React, { useState } from "react";
import { Camera } from "lucide-react";

export default function EditProfileForm({ initialData, onSave, onCancel }) {
    const [formData, setFormData] = useState(initialData);
    const [image, setImage] = useState(initialData.image);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, image });
    };

    const initials = formData.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Edit Profile</h2>
            <p className="text-gray-500 mb-6">Update your profile information</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar */}
                <div className="flex justify-center">
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => alert("Avatar upload coming soon!")}
                    >
                        {image ? (
                            <img
                                src={image}
                                alt="avatar"
                                className="h-32 w-32 rounded-full border-4 border-blue-200 object-cover"
                            />
                        ) : (
                            <div className="h-32 w-32 rounded-full border-4 border-blue-200 bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                                {initials}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Input fields */}
                <div className="grid gap-4 md:grid-cols-2">
                    <InputField
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                    />
                    <InputField
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="md:col-span-2"
                    />
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

// ✅ Correct PascalCase component
const InputField = ({ label, name, value, onChange, className = "", ...props }) => (
    <div className={className}>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-blue-500"
            {...props}
        />
    </div>
);
