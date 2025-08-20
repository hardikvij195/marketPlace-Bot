"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";
import { Button } from "../../components/ui/button";
import { Copy } from "lucide-react";
import { showToast } from "../../../hooks/useToast"; // ✅ using your helper

export default function ShowUserId() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      // ✅ get currently logged-in user
      const {
        data: { user },
        error: authError,
      } = await supabaseBrowser.auth.getUser();

      if (authError || !user) {
        console.error("Error getting logged-in user:", authError?.message);
        setLoading(false);
        return;
      }

      // ✅ fetch user row from "users" table
      const { data, error } = await supabaseBrowser
        .from("users")
        .select("id")
        .eq("id", user.id) // match logged-in user
        .single();

      if (error) {
        console.error("Error fetching user row:", error.message);
      } else {
        setUserId(data.id);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleCopy = async () => {
    if (!userId) return;
    try {
      await navigator.clipboard.writeText(userId);
      showToast({
        title: "Copied!",
        description: "User ID copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast({
        title: "Error",
        description: "Failed to copy User ID.",
      });
    }
  };

  return (
    <div className="flex items-center gap-4 p-2">
      <div className="text-md font-semibold">User ID :</div>
      {loading ? (
        <p>Loading...</p>
      ) : userId ? (
        <div className="flex items-center gap-2">
          <code className="px-2 py-2 bg-gray-100 rounded text-sm">{userId}</code>
          <Button onClick={handleCopy} className="bg-blue-600">
            <Copy className="text-white" />
          </Button>
        </div>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
}
