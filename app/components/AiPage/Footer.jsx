'use client'

import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowUpRight, Github, Twitter, Linkedin } from 'lucide-react';
import { IoLogoWhatsapp } from "react-icons/io";
import FloatingActionButton from '../../components/FloatingActionButton'
import Link from 'next/link';




// This is a responsive footer component built with React and Tailwind CSS.
// It includes contact information, social media links, a "Chat With Us" button, and a copyright notice.
export default function Footer() {
  return (
    <footer className="bg-[#051C34] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Get In Touch Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Get In Touch With us</h2>
            {/* <div className="flex items-center gap-4 ">
              <MapPin size={24} />
              <span>1, India</span>
            </div> */}
            {/* <div className="flex items-center gap-4 ">
              <Phone size={24} />
              <span>+1 (469) 214-6349</span>
              <span>+91 9773603818</span>
              <span>+91 8588099741</span>
            </div> */}
            <div className="flex items-center gap-4 ">
              <Mail size={24} />
              {/* <span>fbmarketplacebots@gmail.com</span> */}
              <span>info@fbmarketplacebots.com</span>
              {/* <span>info@hvtechnologies.app</span> */}
            </div>
            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <a href="/terms-of-use" className=" transition-colors duration-200">
                Terms Of Use
              </a>
              <Link href="/privacy-policy" className=" transition-colors duration-200">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Follow Us Section */}
          <div className="space-y-6 flex flex-col items-start lg:items-end">
            {/* <h2 className="text-3xl font-bold">Follow Us</h2>
            <div className="flex items-center gap-4">
              <a href="#" className="border border-white rounded-md p-2">
                <Facebook size={20} />
              </a>
              <a href="#" className="">
                <Instagram size={34} />
              </a>
              <a href="#" className="">
                <Youtube size={44} />
              </a>
            </div> */}
           
       
          </div>
        <FloatingActionButton />
        </div>

        {/* Separator Line */}
        <hr className="my-6 border-gray-700" />

        {/* Copyright Section */}
        <div className="text-center text-gray-500">
          <p>Copyright 2025 • Hv Technologies. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
