// app/dashboard/_components/Header.tsx
"use client";

import { Button } from "../../components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  RefreshCcw,
} from "lucide-react";
import { clearUser } from "../../../store/reducers/userSlice";
import { useDispatch } from "react-redux";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HeaderProps {
  sidebarCollapsed?: boolean;
  setSidebarCollapsed?: (collapsed: boolean) => void;
  setSidebarOpen?: (open: boolean) => void;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const pathName: any = {
  "/dashboard/profile": "Profile",
  "/dashboard/subscription": "My Subscription",
  "/dashboard/subscription-buy": "Buy Subscription",
  "/dashboard/subscription-buy/success": "Subscription",
  "/dashboard/subscription-buy/cancel": "Subscription",
  "/dashboard": "Dashboard",
  "/dashboard/calculator": "Calculator",
  "/dashboard/user-tools": "Tools",
  "/dashboard/invoices": "Invoices",

};

const Header = ({ collapsed, setCollapsed }: HeaderProps) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabaseBrowser.auth.signOut();
      if (error) throw error;

      dispatch(clearUser());
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed?.(!collapsed)}
            className="h-10 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
          </Button>
           <span className="lg:text-lg md:text-md text-sm font-bold text-gray-800">
          {pathName[pathname] || "Dashboard"}
        </span>
        </div>
       

      {/* Right Section: Icons */}
      <div className="flex items-center space-x-2">
        <Link href="/dashboard">
          <Button
            variant="default"
            size="icon"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Home className="h-4 w-4" />
          </Button>
        </Link>

        <Button
          variant="outline"
          size="icon"
          onClick={() => window.location.reload()}
          className="h-9 w-9"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        
      </div>
 
</header>

  );
};

export default Header;
