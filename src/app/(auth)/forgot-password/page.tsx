"use client";

import { useState } from "react";

import Link from "next/link";

import MessagePage from "@/components/layout/message-page";
import LinkText from "@/components/link-text";
import TextInputField from "@/features/auth/components/text-input-field";
import ActionButton from "@/features/button/components/action";
import LinkButton from "@/features/button/components/link";
import formatApiError from "@/lib/utils/api/format-api-error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const stopRefresh = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!email) {
      alert("Missing email");
      return false;
    }

    try {
      const res = await fetch("/api/auth/start-password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setEmailSent(true);
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
      {emailSent ? (
        <MessagePage
          title="Check your email"
          description={`A password reset link was sent to ${email}.`}
          buttons={[
            <LinkButton
              key="0"
              buttonStyle="primary"
              label="Back to Login"
              href="/login"
            />,
          ]}
        />
      ) : (
        <form
          onSubmit={stopRefresh}
          className="flex w-80 flex-col items-center"
        >
          {/* Title */}
          <h1 className="font-display text-lion mb-4 block text-center text-5xl leading-none md:text-8xl">
            forgot password
          </h1>

          {/* Email */}
          <TextInputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
          />

          <div className="flex w-full items-center justify-between">
            {/* Forgot Password */}
            <Link href="/login" className="mb-8 text-xs">
              <LinkText>Remembered password?</LinkText>
            </Link>

            {/* Email Button */}
            <ActionButton
              buttonStyle="primary"
              label="Send Link"
              onClick={handleSubmit}
              loadOnSuccess
            />
          </div>
        </form>
      )}
    </div>
  );
}
