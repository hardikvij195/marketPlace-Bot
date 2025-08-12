"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../../store/hooks";
import { setUser } from "../../../store/reducers/userSlice";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";
import { onAuthenticatedUser } from "../../actions/auth"; // new token version
import { Loader } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();
      console.log("[callback] session:", session);

      if (!session) {
        router.replace("/sign-in");
        return;
      }
      const result = await onAuthenticatedUser(session.access_token);
      console.log("[callback] server result:", result);

      if (result.status === 200 && result.user) {
        await supabaseBrowser
          .from("users")
          .update({
            updated_at: new Date().toISOString(), // e.g., "2025-07-05T15:41:23.123Z"
          })
          .eq("id", result.user?.id)
          .select()
          .single();
        
        const { data } = await supabaseBrowser
          .from("user_subscription")
          .select("*")
          .eq("user_id", result.user?.id);
        
        console.log(data)
        dispatch(setUser({ ...result.user, subscriptionPlan : data}));
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }

      setLoading(false);
    })();
  }, [router, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2 mt-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p>Please wait…</p>
      </div>
    );
  }
  return (
    <div className="mt-20 w-full flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <p>Redirecting you to the dashboard...</p>
      </div>
    </div>
  );
}
