"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import formatApiError from "../_utils/format-api-error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Missing email");
      return;
    }
    if (!password) {
      alert("Missing password");
      return;
    }

    await fetch("/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        if (res.ok) {
          router.push("/dashboard");
        } else {
          alert(formatApiError(await res.json()));
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex w-80 flex-col items-center">
        {/* Title */}
        <h1 className="font-display mb-4 block text-5xl leading-none text-lion md:text-8xl">
          login
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-full border px-4 py-2 focus:ring-2 focus:outline-none"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-full border px-4 py-2 focus:ring-2 focus:outline-none"
        />

        <div className="flex w-full items-center justify-between">
          {/* Forgot Password */}
          <Link href="/forgot-password" className="mb-8 text-xs">
            Forgot Password?
          </Link>

          {/* Login Button */}
          <button
            type="submit"
            className="mb-2 cursor-pointer gap-2 rounded-full bg-blue px-4 py-2 font-medium transition"
          >
            login
          </button>
        </div>

        {/* Sign up Link */}
        <div className="w-full text-right text-xs">
          No account?{" "}
          <Link href="/sign-up" className="cursor-pointer">
            Sign up!
          </Link>
        </div>
      </form>
    </div>
  );
}
