"use client";
import React, { useRef, useState } from "react";
import Lottie from "lottie-react";
import contactAnimation from "../../../../assets/contact.json";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Aos from "aos";
import "aos/dist/aos.css";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

const Contact = () => {
  const form = useRef();
  const { register, reset } = useForm();
  const [isSending, setIsSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    emailjs.sendForm(
      "service_wd97pr7",
      "template_2cboo3d",
      form.current,
      "Psn6q2BKvm8M_0pAh"
    ).then(() => {
      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Your message has been delivered successfully.",
        confirmButtonColor: "#4f46e5",
      });
      reset();
      setIsSending(false);
    },
      (error) => {
        toast.success("Failed to send message.");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to send message. Please try again!",
          confirmButtonColor: "#ef4444",
        });
        console.log(error);
        setIsSending(false);
      }
    );
  };

  return (
    <section className="py-20 bg-muted/30 dark:bg-muted/20 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div
          className="text-center mb-16"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let&apos;s work together
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got a question or an idea? Drop us a message and we’ll get back to
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side */}
          <div
            className="p-8 border border-border shadow-md rounded-[3.75rem_0.375rem_0.375rem_0.375rem] bg-background transition-colors"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            {/* Animation */}
            <div className="w-full h-auto flex justify-center">
              <Lottie
                className="max-w-[300px] md:max-w-[400px] lg:max-w-[500px] w-full h-auto"
                animationData={contactAnimation}
                loop={true}
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-4 text-foreground relative mb-0">
              {/* Email */}
              <div
                className="flex items-center gap-3"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="p-3 bg-primary/20 text-primary rounded-xl">
                  <MdEmail size={22} />
                </div>
                <p className="text-lg">hello@workstream.com</p>
              </div>

              {/* Phone */}
              <div
                className="flex items-center gap-3"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="p-3 bg-secondary/20 text-secondary rounded-xl">
                  <FaPhoneVolume size={22} />
                </div>
                <p className="text-lg">+1 (307) 393-8955</p>
              </div>

              {/* Location */}
              <div
                className="flex items-center gap-3"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="p-3 bg-accent/20 text-accent rounded-xl">
                  <MdLocationOn size={22} />
                </div>
                <p className="text-lg">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div
            className="p-5 rounded-md shadow-lg border border-border bg-background transition-colors grid"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <h2 className="text-2xl font-bold text-foreground">Send a Message</h2>
            <p className="text-sm text-muted-foreground">
              If you would like to discuss anything related to payment, account,
              licensing, partnerships, or have pre-sales questions, you’re at
              the right place.
            </p>

            <form ref={form} className="space-y-2" onSubmit={sendEmail}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Your Name *
                  </label>
                  <input
                    {...register("firstName", { required: true })}
                    placeholder="your name"
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Email *
                  </label>
                  <input
                    {...register("email", { required: true })}
                    placeholder="your email"
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Company Name *
                </label>
                <input
                  {...register("company", { required: true })}
                  placeholder="Enter your company name"
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Phone Number *
                </label>
                <input
                  {...register("phone", { required: true })}
                  placeholder="Enter your phone number"
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Message *
                </label>
                <textarea
                  {...register("message", { required: true })}
                  placeholder="Your message here..."
                  rows={6}
                  className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <button
                disabled={isSending}
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-primary text-primary-foreground py-3 px-8 hover:bg-primary/80 transition-colors"
              >
                {isSending ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
