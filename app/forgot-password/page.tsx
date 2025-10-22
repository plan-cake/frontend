"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import formatApiError from "@/app/_utils/format-api-error";
import MessagePage from "@/app/ui/layout/message-page";
import LinkText from "@/app/ui/components/link-text";
import TextInputField from "@/app/ui/components/auth/text-input-field";

export default function Page() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const isSubmitting = useRef(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting.current) return;
    isSubmitting.current = true;

    if (!email) {
      alert("Missing email");
      isSubmitting.current = false;
      return;
    }

    await fetch("/api/auth/start-password-reset/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(async (res) => {
        if (res.ok) {
          setEmailSent(true);
        } else {
          alert(formatApiError(await res.json()));
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("An error occurred. Please try again.");
      });

    isSubmitting.current = false;
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {emailSent ? (
        <MessagePage
          title="Check your email"
          description={`A password reset link was sent to ${email}.`}
          buttons={[
            {
              type: "primary",
              label: "back to login",
              onClick: () => router.push("/login"),
            },
          ]}
        />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-80 flex-col items-center"
        >
          {/* Title */}
          <h1 className="font-display mb-4 block text-center text-5xl leading-none text-lion md:text-8xl">
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
            <button
              type="submit"
              className="mb-2 cursor-pointer gap-2 rounded-full bg-blue px-4 py-2 font-medium text-white transition dark:bg-red"
            >
              Send Link
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
