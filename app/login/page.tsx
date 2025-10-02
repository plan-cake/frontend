"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });

    // TODO: Replace with real authentication
    if (email === "test" && password === "1234") {
      router.push("/dashboard");
    } else {
      alert("Invalid email or password");
    }
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
