"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import MessagePage from "@/components/layout/message-page";
import ActionButton from "@/features/button/components/action-button";
import LinkButton from "@/features/button/components/link-button";
import formatApiError from "@/lib/utils/api/format-api-error";

export default function Page() {
  const router = useRouter();
  const lastEmailResend = useRef(Date.now());
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("register_email");
    if (!storedEmail) {
      // the user shouldn't be here
      router.push("/login");
    } else {
      setEmail(storedEmail);
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
      return false;
    }

    try {
      const res = await fetch("/api/auth/resend-register-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        alert("Email resent. Please check your inbox.");
        lastEmailResend.current = Date.now();
        return true;
      } else {
        alert(formatApiError(await res.json()));
        return false;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("An error occurred. Please try again.");
      return false;
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <MessagePage
        title="Check your email"
        description={`A verification link was sent to ${email}.`}
        buttons={[
          <ActionButton
            key="0"
            buttonStyle="secondary"
            label="Resend Email"
            onClick={handleResendEmail}
          />,
          <LinkButton
            key="1"
            buttonStyle="primary"
            label="Go to Login"
            href="/login"
          />,
        ]}
      />
    </div>
  );
}
