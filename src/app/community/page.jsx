"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import Link from "next/link";
import { Star, Facebook, Youtube, Instagram,  ArrowLeft } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

export default function CommunityFeedbackForm() {
  const { register, handleSubmit, reset } = useForm();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const cards = [
    {
      id: 1,
      icon: <Facebook className="w-8 h-8" />,
      title: "Join our group",
      desc: "Share your thoughts, ideas, and projects with the community.",
      link: "Follow us on Facebook",
      href: "https://facebook.com",
      bg: "bg-gradient-to-br from-blue-900 to-blue-600",
    },
    {
      id: 2,
      icon: <Youtube className="w-8 h-8" />,
      title: "Join our channel",
      desc: "Watch our latest videos and keep up with the latest news.",
      link: "Follow us on YouTube",
      href: "https://youtube.com",
      bg: "bg-gradient-to-br from-red-900 to-red-600",
    },
    {
      id: 3,
      icon: <FaXTwitter className="w-8 h-8" />,
      title: "Follow our updates",
      desc: "Get the latest news and quick updates from our team.",
      link: "Follow us on X",
      href: "https://twitter.com",
      bg: "bg-gradient-to-br from-gray-900 to-gray-700",
    },
    {
      id: 4,
      icon: <Instagram className="w-8 h-8" />,
      title: "See our gallery",
      desc: "Browse our latest visual content and behind-the-scenes.",
      link: "Follow us on Instagram",
      href: "https://instagram.com",
      bg: "bg-gradient-to-br from-pink-900 to-pink-600",
    },
  ];

  const onSubmit = async (data) => {
    if (rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Select a rating!",
        text: "Please rate your experience before submitting.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setLoading(true);

    try {
      const feedback = {
        name: data.name,
        role: data.role,
        company: data.company,
        image: data.image || "https://via.placeholder.com/150", // default image if none
        rating,
        quote: data.quote,
      };

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Thank you!",
          text: "Your testimonial has been submitted successfully.",
          confirmButtonColor: "#4f46e5",
        });
        reset();
        setRating(0);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong while sending your testimonial.",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Could not connect to the server. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 relative">
      <Link
        href="/"
        className="absolute top-6 left-6 text-primary hover:text-primary/80 transition"
      >
        <ArrowLeft className="w-7 h-7" />
      </Link>

      {/* ===== Community Cards ===== */}
      <div className="text-center mb-20">
        <h2 className="text-3xl font-bold mb-3">Join our community</h2>
        <p className="text-gray-500 mb-12">
          Connect with others, share experiences, and stay in the loop.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              data-aos="fade-up"
              data-aos-delay={card.id * 100}
              className={`rounded-xl p-6 text-left text-white shadow-md hover:scale-105 transition-transform duration-300 ${card.bg}`}
            >
              <div className="mb-4">{card.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm mb-4">{card.desc}</p>
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium underline"
              >
                {card.link} →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Feedback Form ===== */}
      <div className="text-center mb-20">
        <h2 className="text-3xl font-bold mb-3">Share Your Testimonial</h2>
        <p className="text-gray-500 mb-12">
          Tell us about your experience with WorkStream. Your story helps inspire others!
        </p>

        <div
          data-aos="fade-up"
          className="max-w-3xl mx-auto p-8 bg-card rounded-2xl shadow-lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-left">Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1 text-left">Role</label>
              <input
                type="text"
                {...register("role", { required: true })}
                placeholder="e.g. IT Administrator"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium mb-1 text-left">Company</label>
              <input
                type="text"
                {...register("company", { required: true })}
                placeholder="e.g. NetSecure"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium mb-1 text-left">
                Profile Image URL
              </label>
              <input
                type="url"
                {...register("image")}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2 text-left">Rating</label>
              <div className="flex space-x-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className={`w-7 h-7 cursor-pointer ${
                      (hover || rating) >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quote */}
            <div>
              <label className="block text-sm font-medium mb-1 text-left">Testimonial</label>
              <textarea
                {...register("quote", { required: true })}
                rows="4"
                placeholder="Write your experience here..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition flex justify-center items-center"
            >
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              ) : (
                "Submit Testimonial"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
