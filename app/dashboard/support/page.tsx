"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "../../../lib/supabaseBrowser"; 
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { showToast } from "../../../hooks/useToast";
import FloatingActionButton from "../../components/FloatingActionButton";
import { Loader } from "lucide-react";

export default function ContactUsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);

  const WEBHOOK_URL = "https://hook.eu2.make.com/lf8nye8n8kaugcn4yg6ykedk2o47jzv5";

  // Fetch logged-in user profile
  useEffect(() => {
    const fetchUser = async () => {
      setFetchingUser(true);
      const { data: { user } } = await supabaseBrowser.auth.getUser();

      if (user) {
        const { data: profile } = await supabaseBrowser
          .from("users")
          .select("name, email, phone")
          .eq("id", user.id)
          .single();

        if (profile) {
          setForm((prev) => ({
            ...prev,
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
          }));
        }
      }
      setFetchingUser(false);
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      id: "11", // fixed ID
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    };

    try {
      // Save to Supabase
      const { error } = await supabaseBrowser
        .from("contact_us_messages")
        .insert([payload]);

      if (error) throw new Error("Failed to save message in database");

      // Send to Webhook
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-make-apikey": "DriveXAuth", // your Make.com API key
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Webhook submission failed");
      }

      showToast({
        title: "Success",
        description: "Message sent successfully!",
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      showToast({
        title: "Error",
        description: "Something went wrong while sending the message!",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen pt-10">
      <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          <Textarea
            name="message"
            placeholder="Your message..."
            value={form.message}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white flex justify-center items-center"
            disabled={loading}
          >
            {loading && <Loader className="h-5 w-5 mr-2 animate-spin text-white" />}
            {loading ? "Sending..." : "Request Meeting"}
          </Button>
        </form>
      </div>
      <FloatingActionButton />
    </div>
  );
}
