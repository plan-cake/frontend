"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Checkbox from "@/components/checkbox";
import LinkText from "@/components/link-text";
import TextInputField from "@/components/text-input-field";
import { useAccount } from "@/features/account/context";
import ActionButton from "@/features/button/components/action";
import { RateLimitBanner } from "@/features/system-feedback";
import { useFormErrors } from "@/lib/hooks/use-form-errors";
import { MESSAGES } from "@/lib/messages";
import { formatApiError } from "@/lib/utils/api/handle-api-error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAccount();
  const router = useRouter();

  // TOASTS AND ERROR STATES
  const { errors, handleError, clearAllErrors, handleGenericError } =
    useFormErrors();

  const handleEmailChange = (value: string) => {
    handleError("email", "");
    handleError("api", "");
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    handleError("password", "");
    handleError("api", "");
    setPassword(value);
  };

  const stopRefresh = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    clearAllErrors();

    if (!email) {
      handleError("email", MESSAGES.ERROR_EMAIL_MISSING);
      return false;
    }
    if (!password) {
      handleError("password", MESSAGES.ERROR_PASSWORD_MISSING);
      return false;
    }

    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      });

      if (res.ok) {
        login(await res.json());
        router.push("/dashboard");
        return true;
      } else {
        const body = await res.json();

        const errorMessage = formatApiError(body);

        if (res.status === 429) {
          handleError("rate_limit", errorMessage);
        } else if (errorMessage.includes("Email:")) {
          handleError("email", errorMessage.split("Email:")[1].trim());
        } else if (errorMessage.includes("Password:")) {
          handleError("password", errorMessage.split("Password:")[1].trim());
        } else {
          handleError("api", errorMessage);
        }
        return false;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      handleGenericError();
      return false;
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <form onSubmit={stopRefresh} className="flex w-80 flex-col items-center">
        {/* Title */}
        <h1 className="font-display text-lion mb-4 block text-5xl leading-none md:text-8xl">
          login
        </h1>

        {/* Rate Limit Error */}
        {errors.rate_limit && (
          <RateLimitBanner>{errors.rate_limit}</RateLimitBanner>
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

        {/* Password */}
        <TextInputField
          id={"password"}
          type="password"
          label="Password*"
          value={password}
          onChange={handlePasswordChange}
          outlined
          error={errors.password || errors.api}
        />

        <div className="flex w-full items-start justify-between">
          <div className="m-0 flex flex-col gap-2">
            {/* Remember Me Checkbox */}
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            {/* Forgot Password */}
            <Link href="/forgot-password" className="text-xs">
              <LinkText>Forgot password?</LinkText>
            </Link>
          </div>

          {/* Login Button */}
          <ActionButton
            buttonStyle="primary"
            label="Login"
            onClick={handleSubmit}
            loadOnSuccess
          />
        </div>

        {/* Register Link */}
        <div className="mt-2 w-full text-right text-xs">
          No account?{" "}
          <Link href="/register">
            <LinkText>Register!</LinkText>
          </Link>
        </div>
      </form>
    </div>
  );
}
