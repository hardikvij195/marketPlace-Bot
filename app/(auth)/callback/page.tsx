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
        const prompt = `Go through the transcript and reply according to the following rules:

If the Client has already shared his phone number then reply him that one our reps will contact him and generate a unique line every time.
Use this message : "One of my team members will contact you and discuss details soon."

If the Client has not shared his phone number then ask him to share his phone number so that one of our reps can contact him.
Use this message : "Hi {{name}}, please leave your number and my team will contact you."

If the Client has already shared his phone number and the last reply is something else like ‘ok’ or ‘thanks’ or something that is ending the conversation then reply him ‘👍’ or ‘Your Welcome’ or ‘Ok’ or something simple and positive.`;

        const aiId = `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`;
        const webHook =
          "https://hook.eu2.make.com/dx022ckz4pzpcnhdksgbn277fmf1ca7u";

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
                fb_chatbot_prompt: prompt,
                fb_chatbot_open_ai_id: aiId,
                fb_chatbot_webhook: webHook,
                new_user: "TRUE",
                is_anonymous: "False",
              },
            ]);

          if (insertError) {
            console.error("Error inserting user:", insertError);
          } else {
            // ✅ Call webhook after successful user creation
            try {
              await fetch(
                "https://hook.eu2.make.com/dx022ckz4pzpcnhdksgbn277fmf1ca7u",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: userId,
                    email,
                   
                  }),
                }
              );
              console.log("✅ Webhook called successfully for new user");
            } catch (err) {
              console.error("❌ Error calling webhook:", err);
            }
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

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader className="h-10 w-10 animate-spin text-blue-600" />
        <h3 className="text-xl font-bold">Authenticating...</h3>
        <p>Please wait while we verify your credentials</p>
      </div>
    </div>
  );
}
