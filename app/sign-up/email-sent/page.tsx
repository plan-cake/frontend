"use client";

import formatApiError from "@/app/_utils/format-api-error";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import MessagePage from "../../ui/layout/message-page";

export default function Page() {
  const router = useRouter();
  const email = sessionStorage.getItem("sign_up_email");
  const lastEmailResend = useRef(Date.now());

  useEffect(() => {
    if (!email) {
      // the user shouldn't be here
      router.push("/login");
    }
    // clear the email from storage
    sessionStorage.removeItem("sign_up_email");
  }, []);

  if (!email) {
    // stop rendering if there's no email
    return null;
  }

  const handleResendEmail = async () => {
    const emailResendCooldown = 30000; // 30 seconds
    let timeLeft =
      (emailResendCooldown - (Date.now() - lastEmailResend.current)) / 1000;
    timeLeft = Math.ceil(timeLeft);
    if (timeLeft > 0) {
      alert(`Slow down! ${timeLeft} seconds until you can send again.`);
      return;
    }

    await fetch("/api/auth/resend-register-email/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(async (res) => {
        if (res.ok) {
          alert("Email resent. Please check your inbox.");
        } else {
          alert(formatApiError(await res.json()));
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("An error occurred. Please try again.");
      });

    lastEmailResend.current = Date.now();
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <MessagePage
        title="Check your email"
        description={`A verification link was sent to ${email}.`}
        buttons={[
          {
            type: "secondary",
            label: "resend email",
            onClick: handleResendEmail,
          },
          {
            type: "primary",
            label: "go to login",
            onClick: () => router.push("/login"),
          },
        ]}
      />
    </div>
  );
}
