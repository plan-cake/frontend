"use client";

import React, { useContext, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Checkbox from "@/components/checkbox";
import LinkText from "@/components/link-text";
import TextInputField from "@/features/auth/components/text-input-field";
import ActionButton from "@/features/button/components/action-button";
import { LoginContext } from "@/lib/providers";
import formatApiError from "@/lib/utils/api/format-api-error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setLoggedIn } = useContext(LoginContext);
  const router = useRouter();

  const stopRefresh = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!email) {
      alert("Missing email");
      return false;
    }
    if (!password) {
      alert("Missing password");
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
      <form onSubmit={stopRefresh} className="flex w-80 flex-col items-center">
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
