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
  "/dashboard/inventory": "Inventory",
  "/dashboard/training-videos": "Training Videos",
  "/dashboard/history": "Calculator History",

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
    <header className="bg-white shadow-sm border-b border-b-gray-200 sticky top-0 z-10">
  <div className="container px-4 sm:px-6 lg:px-4">
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center gap-2">
        <div className=" md:flex">
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
        </div>
        <span className="text-lg sm:text-xl font-bold text-gray-700 truncate max-w-[180px] sm:max-w-none">
          {pathName[pathname] || "Dashboard"}
        </span>
      </div>

      {/* Right Section: Icons */}
      <div className="flex items-center gap-2">
        <Link href="/">
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
    </div>
  </div>
</header>

  );
};

export default Header;
