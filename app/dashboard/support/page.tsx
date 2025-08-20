"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "../../../lib/supabaseBrowser"; // adjust your path
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { showToast } from "../../../hooks/useToast"; // your custom hook
import FloatingActionButton from "../../components/FloatingActionButton";

export default function ContactUsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch logged-in user profile
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();

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
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabaseBrowser.from("contact_us_messages").insert([
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      },
    ]);

    setLoading(false);


    if (error) {
      showToast({
        title: "Error",
        description: "Something went wrong while Sending Meeting Request!",
      });
    } else {
      showToast({
        title: "Success",
        description: "Meeting Request Sent successfully!",
      });
    }
  }


  return (
    <div className="w-full bg-white min-h-screen pt-10 ">
    <div className="max-w-lg mx-auto  p-6 bg-white shadow rounded-xl">
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
        <Button type="submit" className="w-full bg-blue-600 text-white" disabled={loading}>
          {loading ? "Meeting Requesting..." : "Request Meeting"}
        </Button>
      </form>
    </div>
    <FloatingActionButton />
    </div>
  );
}
