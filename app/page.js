"use client";
import React, { useEffect, useState } from "react";
import How from "../app/components/AiPage/How";
import WhyChooseUs from "./components/AiPage/WhyChooseUs";
import Package from "../app/components/AiPage/Package";
import Testimonials from "../app/components/AiPage/Testimonials";
import Contact from "../app/components/AiPage/ContactUs";
import AiHero from "./components/AiPage/AiHero";
import Footer from "./components/AiPage/Footer";
import Header from "./components/AiPage/Header";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../lib/supabaseBrowser";
import { Loader } from "lucide-react";

const AiPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabaseBrowser.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log("User already logged in:", data.user);
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
       <div className="flex flex-col items-center justify-center gap-2 mt-20">
      
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="space-y-10">
        <AiHero />
        <section id="how-it-works">
          <How />
        </section>
        <section id="why-choose-us">
          <WhyChooseUs />
        </section>
        <section id="subscription">
          <Package />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <section id="contact-us">
          <Contact />
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AiPage;
