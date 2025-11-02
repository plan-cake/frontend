"use client";

import React, { useRef, useState, useContext } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Checkbox from "@/components/checkbox";
import LinkText from "@/components/link-text";
import TextInputField from "@/features/auth/components/text-input-field";
import { useToast } from "@/features/toast/context";
import { LoginContext } from "@/lib/providers";
import { formatApiError } from "@/lib/utils/api/handle-api-error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setLoggedIn } = useContext(LoginContext);
  const isSubmitting = useRef(false);
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
    addToast("error", message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setErrors({});

    if (!email) {
      handleErrors("email", "Missing email");
      isSubmitting.current = false;
      return;
    }
    if (!password) {
      handleErrors("password", "Missing password");
      isSubmitting.current = false;
      return;
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
        return;
      } else {
        const body = await res.json();

        const errorMessage = formatApiError(body);
        if (errorMessage.includes("Email:")) {
          handleErrors("email", errorMessage.split("Email:")[1].trim());
        } else if (errorMessage.includes("Password:")) {
          handleErrors("password", errorMessage.split("Password:")[1].trim());
        } else {
          handleErrors("api", errorMessage);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex w-80 flex-col items-center">
        {/* Title */}
        <h1 className="font-display text-lion mb-4 block text-5xl leading-none md:text-8xl">
          login
        </h1>

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

        <div className="flex w-full justify-between">
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
          <button
            type="submit"
            className="bg-blue dark:bg-red mb-2 cursor-pointer gap-2 rounded-full px-4 py-2 font-medium text-white transition"
          >
            Login
          </button>
        </div>

        {/* Register Link */}
        <div className="w-full text-right text-xs">
          No account?{" "}
          <Link href="/register">
            <LinkText>Register!</LinkText>
          </Link>
        </div>
      </form>
    </div>
  );
}
