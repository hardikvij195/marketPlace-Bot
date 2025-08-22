import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ToastProvider } from "./components/toast-provider";
import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

<Script src="https://www.google.com/recaptcha/api.js" />

export const metadata = {
  title: "FB Marketplace Chatbot",
  description: "Leads Platform to showcase the Leads",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <Providers>
        {children}
        </Providers>
        <ToastProvider/>
      </body>
    </html>
  );
}
