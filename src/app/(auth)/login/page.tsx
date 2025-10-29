"use client";

import React, { useRef, useState, useContext } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Checkbox from "@/components/checkbox";
import LinkText from "@/components/link-text";
import TextInputField from "@/features/auth/components/text-input-field";
import { LoginContext } from "@/lib/providers";
import formatApiError from "@/lib/utils/api/format-api-error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setLoggedIn } = useContext(LoginContext);
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
    if (!password) {
      alert("Missing password");
      isSubmitting.current = false;
      return;
    }

    await fetch("/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember_me: rememberMe }),
    })
      .then(async (res) => {
        if (res.ok) {
          setLoggedIn(true);
          router.push("/dashboard");
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
      <form onSubmit={handleSubmit} className="flex w-80 flex-col items-center">
        {/* Title */}
        <h1 className="font-display text-lion mb-4 block text-5xl leading-none md:text-8xl">
          login
        </h1>

        {/* Email */}
        <TextInputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={setEmail}
        />

        {/* Password */}
        <TextInputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
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
