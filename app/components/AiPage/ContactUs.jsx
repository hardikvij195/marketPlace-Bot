"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Phone, MessageSquare } from "lucide-react";

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    };

    try {
      const response = await axios.post(
        "https://hook.eu2.make.com/htagucv37o1v4veb4snwwmzeaxrpkcj4",
        payload
      );
      console.log("Webhook response:", response.data);
      reset();
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-10 px-4 md:px-12 lg:px-24 text-black bg-white">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">Contact US</h1>
        <p className="text-gray-600 text-lg">
          Have questions? Need support? We’re here to help you succeed <br/> with
          MarketplaceBot
        </p>
      </div>

      <div className="mx-auto bg-white rounded-lg  p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <input
                        id="name"
                        type="text"
                        {...field}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                {/* E-Mail */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-Mail
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        id="email"
                        type="email"
                        {...field}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Controller
                  name="subject"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Subject is required" }}
                  render={({ field }) => (
                    <input
                      id="subject"
                      type="text"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Controller
                  name="message"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Message is required" }}
                  render={({ field }) => (
                    <textarea
                      id="message"
                      rows="6"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                    ></textarea>
                  )}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Right Column: Other Ways to Reach Us */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Other Ways to reach us</h2>
            <div className="space-y-6">
              {/* E-mail Support */}
              <div className="flex items-start p-4  rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 mr-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">E-Mail Support</h3>
                  <p className="text-gray-600">Marketplaces@gmail.com</p>
                  <p className="text-gray-500 text-sm">we reply within 24 hours</p>
                </div>
              </div>
              {/* Phone Support */}
              <div className="flex items-start p-4  rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 mr-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone Support</h3>
                  <p className="text-gray-600">+603 4784 273 12</p>
                  <p className="text-gray-500 text-sm">Mon-Fri, 09:00am-06:00am</p>
                </div>
              </div>
              {/* Live Chat */}
              <div className="flex items-start p-4  rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 mr-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Live Chat available</h3>
                  <p className="text-gray-600">Available 24/7</p>
                  <p className="text-gray-500 text-sm">live chat with bot</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;