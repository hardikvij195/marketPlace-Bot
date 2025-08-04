'use client'

import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowUpRight, Github, Twitter, Linkedin } from 'lucide-react';
import { IoLogoWhatsapp } from "react-icons/io";



// This is a responsive footer component built with React and Tailwind CSS.
// It includes contact information, social media links, a "Chat With Us" button, and a copyright notice.
export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Get In Touch Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Get In Touch With us</h2>
            <div className="flex items-center gap-4 text-gray-400">
              <MapPin size={24} />
              <span>140301, Sunny Enclave, India</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <Phone size={24} />
              <span>+603 4784 273 12</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <Mail size={24} />
              <span>Marketplaces@gmail.com</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms Of Use
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Follow Us Section */}
          <div className="space-y-6 flex flex-col items-start lg:items-end">
            <h2 className="text-3xl font-bold">Follow Us</h2>
            <div className="flex items-center gap-4">
              <a href="#" className="p-3 border rounded-full hover:bg-white hover:text-slate-950 transition-colors duration-200">
                <Facebook size={24} />
              </a>
              <a href="#" className="p-3 border rounded-full hover:bg-white hover:text-slate-950 transition-colors duration-200">
                <Instagram size={24} />
              </a>
              <a href="#" className="p-3 border rounded-full hover:bg-white hover:text-slate-950 transition-colors duration-200">
                <Youtube size={24} />
              </a>
              <a href="#" className="p-3 border rounded-full hover:bg-white hover:text-slate-950 transition-colors duration-200">
                <Twitter size={24} />
              </a>
              <a href="#" className="p-3 border rounded-full hover:bg-white hover:text-slate-950 transition-colors duration-200">
                <Linkedin size={24} />
              </a>
            </div>
            <a 
              href="#"
              className="mt-6 bg-lime-400 text-slate-950 font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 hover:bg-lime-500 transition-colors duration-200"
            >
              Chat With Us
              <ArrowUpRight size={20} />
            </a>
            {/* WhatsApp Icon - this is a simple SVG to replicate the image */}
            <IoLogoWhatsapp  size={80} className='text-green-500'/>
          </div>
        </div>

        {/* Separator Line */}
        <hr className="my-12 border-gray-700" />

        {/* Copyright Section */}
        <div className="text-center text-gray-500">
          <p>Copyright 2025 • Marketplace. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
