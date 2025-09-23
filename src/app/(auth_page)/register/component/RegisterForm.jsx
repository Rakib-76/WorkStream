"use client";
import React from 'react'
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { registerUser } from '../../../actions/auth/registerUser';
import Swal from "sweetalert2";

export default function RegisterForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            // File type field handle korte
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("password", data.password);
            if (data.image?.[0]) {
                formData.append("image", data.image[0]);
            }

            const result = await registerUser(formData);

            if (result?.success) {
                Swal.fire({
                    icon: "success",
                    title: "Registered Successfully!",
                    text: "Welcome to WorkStream 🚀",
                    timer: 2000,
                    showConfirmButton: false
                });
                reset();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: result?.message || "Something went wrong. Please try again."
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Server error. Please try again later."
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
                    <h1 className='text-4xl font-semibold'>Register !</h1>

                    {/* Name Field */}
                    <label className="label">Name</label>
                    <input
                        type="text"
                        autoComplete="off"
                        {...register('name', { required: true })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#438af7]"
                        placeholder="Enter your name"
                    />
                    {errors.name && (
                        <p role='alert' className='text-red-600'>Name is required</p>
                    )}

                    {/* Image Field */}
                    <label className="label">Your Photo</label>
                    <input
                        type="file"
                        {...register('image', { required: true })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#438af7]"
                        placeholder="Your Profile picture"
                    />
                    {errors.image && (
                        <p role='alert' className='text-red-600'>Your photo is required</p>
                    )}

                    {/* Email Field */}
                    <label className="label">Email</label>
                    <input
                        type="email"
                        autoComplete="off"
                        {...register('email', { required: true })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#438af7]"
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p role='alert' className='text-red-600'>Email is required</p>
                    )}

                    {/* Password Field */}
                    <label className="label">Password</label>
                    <input
                        type="password"
                        autoComplete="new-password"
                        {...register('password', { required: true, minLength: 6 })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#438af7]"
                        placeholder="Create a password"
                    />
                    {errors.password?.type === "minLength" && (
                        <p role='alert' className='text-red-600'>
                            Password must be at least 6 characters
                        </p>
                    )}
                    {errors.password?.type === "required" && (
                        <p role='alert' className='text-red-600'>
                            Password is required
                        </p>
                    )}

                    <button
                        type="submit"
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium text-lg mt-4"
                    >
                        Sign Up
                    </button>
                </fieldset>

                <p className="text-lg text-center">
                    <small>
                        Already have an account?
                        <Link
                            href='/login'
                            className='btn-link text-blue-500 link-hover ml-1'
                        >
                            SignIn
                        </Link>
                    </small>
                </p>
            </form>
        </div>
    )
}
