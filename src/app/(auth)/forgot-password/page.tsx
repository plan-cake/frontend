"use client";

import { useState } from "react";

import Link from "next/link";

import { Banner } from "@/components/banner";
import MessagePage from "@/components/layout/message-page";
import LinkText from "@/components/link-text";
import TextInputField from "@/components/text-input-field";
import ActionButton from "@/features/button/components/action";
import LinkButton from "@/features/button/components/link";
import { useToast } from "@/features/toast/context";
import { formatApiError } from "@/lib/utils/api/handle-api-error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // TOASTS AND ERROR STATES
  const { addToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEmailChange = (value: string) => {
    setErrors((prev) => ({ ...prev, email: "", api: "" }));
    setEmail(value);
  };

  const handleErrors = (field: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));

    if (field === "api") addToast("error", message);
  };

  const stopRefresh = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!email) {
      handleErrors("email", "Missing email");
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
        const body = await res.json();
        const errorMessage = formatApiError(body);

        if (res.status === 429) {
          handleErrors(
            "rate_limit",
            errorMessage || "Too many attempts. Please try again later.",
          );
        } else {
          handleErrors("api", errorMessage);
        }
        return false;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      addToast("error", "An error occurred. Please try again.");
      return false;
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
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

          {/* Rate Limit Error */}
          {errors.rate_limit && (
            <Banner
              type="error"
              title="Woah! Slow down"
              className="mb-4 w-full"
            >
              {errors.rate_limit}
            </Banner>
          )}

          {/* Email */}
          <TextInputField
            id={"email"}
            type="email"
            label="Email*"
            value={email}
            onChange={handleEmailChange}
            outlined
            error={errors.email || errors.api}
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
