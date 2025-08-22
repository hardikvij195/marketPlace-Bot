"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";
import { Button } from "../../components/ui/button";
import { Copy } from "lucide-react";
import { showToast } from "../../../hooks/useToast";

export default function SheetPage() {
  const [sheetLink, setSheetLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchLink = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabaseBrowser.auth.getUser();

      if (userError || !user) {
        console.error("No user found:", userError);
        return;
      }

      const { data, error } = await supabaseBrowser
        .from("users")
        .select("fb_chatbot_leads_gs_link")
        .eq("id", user.id) // ✅ only fetch for current user
        .single();

      if (error) {
        console.error("Error fetching sheet link:", error.message);
        return;
      }

      if (!data?.fb_chatbot_leads_gs_link) {
        showToast({
          title: "Please wait",
          description: "Google Sheet is being created. Try again in 5 minutes.",
          type: "info",
        });
      }

      setSheetLink(data?.fb_chatbot_leads_gs_link || null);
    };

    fetchLink();
  }, []);

  const handleOpen = () => {
    if (sheetLink) {
      window.open(sheetLink, "_blank");
    } else {
      showToast({
        title: "Please wait",
        description: "Google Sheet is being created. Try again in 5 minutes.",
      });
    }
  };

  const handleCopy = async () => {
    if (!sheetLink) {
      showToast({
        title: "Please wait",
        description: "Google Sheet is being created. Try again in 5 minutes.",
        type: "error",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(sheetLink);
      showToast({
        title: "Copied!",
        description: "Google Sheet link copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast({
        title: "Error",
        description: "Failed to copy link.",
      });
    }
  };

  return (
    <div className="flex gap-3 px-2 items-center">
      <span className="text-md font-medium">Google Sheet for Leads :</span>

      <button onClick={handleOpen} className="focus:outline-none">
        <Image
          src="/sheets.png"
          alt="Open Google Sheet"
          width={40}
          height={40}
          className="cursor-pointer hover:scale-105 transition-transform"
        />
      </button>

      <Button onClick={handleCopy} className="bg-blue-600">
        <Copy className="text-white" />
      </Button>
    </div>
  );
}
