"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { registerUser } from "../../../actions/auth/registerUser";
import Swal from "sweetalert2";
import axios from "axios";

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Image upload to Imgbb
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`;
      const res = await axios.post(imagUploadUrl, formData);

      setProfilePic(res.data.data.url);
      Swal.fire({
        icon: "success",
        title: "Image Uploaded!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Image upload failed",
        text: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Submit form
  const onSubmit = async (data) => {
    try {
      if (!profilePic) {
        Swal.fire({
          icon: "error",
          title: "Photo Required",
          text: "Please upload your photo before registering",
        });
        return;
      }

      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        image: profilePic, // only url save
      });

      if (result?.success) {
        Swal.fire({
          icon: "success",
          title: "Registered Successfully!",
          text: "Welcome to WorkStream 🚀",
          timer: 2000,
          showConfirmButton: false,
        });
        reset();
        setProfilePic(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: result?.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Server error. Please try again later.",
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <Link href="/">
            <ArrowLeft />
          </Link>
          <h1 className="text-4xl font-semibold">Register !</h1>

          {/* Name Field */}
          <label className="label">Name</label>
          <input
            type="text"
            autoComplete="off"
            {...register("name", { required: true })}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#438af7]"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p role="alert" className="text-red-600">
              Name is required
            </p>
          )}

          {/* Image Field */}
          <label className="label">Your Photo</label>
          <input
            type="file"
            onChange={handleImageUpload} // 🔥 file upload handler
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#438af7]"
            placeholder="Your Profile picture"
          />
          {loading && <p className="text-blue-400">Uploading...</p>}
          {profilePic && (
            <img
              src={profilePic}
              alt="preview"
              className="w-20 h-20 rounded-full mt-2 border"
            />
          )}

          {/* Email Field */}
          <label className="label">Email</label>
          <input
            type="email"
            autoComplete="off"
            {...register("email", { required: true })}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#438af7]"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p role="alert" className="text-red-600">
              Email is required
            </p>
          )}

          {/* Password Field */}
          <label className="label">Password</label>
          <input
            type="password"
            autoComplete="new-password"
            {...register("password", { required: true, minLength: 6 })}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#438af7]"
            placeholder="Create a password"
          />
          {errors.password?.type === "minLength" && (
            <p role="alert" className="text-red-600">
              Password must be at least 6 characters
            </p>
          )}
          {errors.password?.type === "required" && (
            <p role="alert" className="text-red-600">
              Password is required
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium text-lg mt-4"
          >
            {loading ? "Please wait..." : "Sign Up"}
          </button>
        </fieldset>

        <p className="text-lg text-center">
          <small>
            Already have an account?
            <Link
              href="/login"
              className="btn-link text-blue-500 link-hover ml-1"
            >
              SignIn
            </Link>
          </small>
        </p>
      </form>
    </div>
  );
}
