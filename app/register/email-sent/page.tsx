"use client";

import formatApiError from "@/app/_utils/format-api-error";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MessagePage from "../../ui/layout/message-page";

export default function Page() {
  const router = useRouter();
  const lastEmailResend = useRef(Date.now());
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("register_email");
    console.log("Stored email:", storedEmail);
    if (!storedEmail) {
      // the user shouldn't be here
      router.push("/login");
    } else {
      setEmail(storedEmail!);
      // don't clear the email from storage, it creates problems when testing
      // it should be deleted after the session ends anyway
    }
  }, [router]); // empty dependency array to run once on initial mount

  if (!email) {
    // don't render until there is an email
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
            label: "Resend Email",
            onClick: handleResendEmail,
          },
          {
            type: "primary",
            label: "Go to Login",
            onClick: () => router.push("/login"),
          },
        ]}
      />
    </div>
  );
}
