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
        const userId = result.user.id;
        const email = result.user.email ?? "";
        const fullName = result.user.user_metadata.full_name ?? "";
        const phone = result.user.phone ?? "";
        const role = "user";
        const status = "active";

        console.log(result.user);
        const { data: existingUser, error: fetchError } = await supabaseBrowser
          .from("users")
          .select("id")
          .eq("id", userId)
          .maybeSingle();

        if (!existingUser) {
          const { error: insertError } = await supabaseBrowser
            .from("users")
            .insert([
              {
                id: userId,
                email,
                name: fullName,
                phone,
                role,
                status,
              },
            ]);

          if (insertError) {
            console.error("Error inserting user:", insertError);
          }
        }

        // Always ensure subscription exists
        const { data: existingSubscription, error: fetchSubError } =
          await supabaseBrowser
            .from("user_subscription")
            .select("id")
            .eq("user_id", userId)
            .maybeSingle();

        if (!existingSubscription) {
          const { error: subInsertError } = await supabaseBrowser
            .from("user_subscription")
            .insert([
              {
                user_id: userId,
              },
            ]);

          if (subInsertError) {
            console.error(
              "Error inserting into user_subscription:",
              subInsertError
            );
          }
        }

        await supabaseBrowser
          .from("users")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", userId);

        const { data } = await supabaseBrowser
          .from("user_subscription")
          .select("*")
          .eq("user_id", userId);

        console.log(data);

        dispatch(setUser({ ...result.user, subscriptionPlan: data }));
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }

      setLoading(false);
    })();
  }, [router, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 mt-20">
        <Loader className="h-8 w-8 animate-spin text-primary text-blue-600" />
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
