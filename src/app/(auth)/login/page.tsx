"use client";

import React, { useContext, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Banner } from "@/components/banner";
import Checkbox from "@/components/checkbox";
import LinkText from "@/components/link-text";
import TextInputField from "@/features/auth/components/text-input-field";
import ActionButton from "@/features/button/components/action";
import { useToast } from "@/features/toast/context";
import { LoginContext } from "@/lib/providers";
import { formatApiError } from "@/lib/utils/api/handle-api-error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setLoggedIn } = useContext(LoginContext);
  const router = useRouter();

  // TOASTS AND ERROR STATES
  const { addToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEmailChange = (value: string) => {
    setErrors((prev) => ({ ...prev, email: "", api: "" }));
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setErrors((prev) => ({ ...prev, password: "", api: "" }));
    setPassword(value);
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
    if (!password) {
      handleErrors("password", "Missing password");
      return false;
    }

    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      });

      if (res.ok) {
        setLoggedIn(true);
        router.push("/dashboard");
        return true;
      } else {
        const body = await res.json();

        const errorMessage = formatApiError(body);

        if (res.status === 429) {
          handleErrors(
            "rate_limit",
            errorMessage || "Too many login attempts. Please try again later.",
          );
        } else if (errorMessage.includes("Email:")) {
          handleErrors("email", errorMessage.split("Email:")[1].trim());
        } else if (errorMessage.includes("Password:")) {
          handleErrors("password", errorMessage.split("Password:")[1].trim());
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
      <form onSubmit={stopRefresh} className="flex w-80 flex-col items-center">
        {/* Title */}
        <h1 className="font-display text-lion mb-4 block text-5xl leading-none md:text-8xl">
          login
        </h1>

        {/* Rate Limit Error */}
        {errors.rate_limit && (
          <Banner type="error" title="Woah! Slow down" className="mb-4 w-full">
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
