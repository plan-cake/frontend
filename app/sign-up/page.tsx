"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up attempt:", {
      email,
      password,
      confirmPassword,
    });

    // TODO: Replace with real sign up information
    if (
      email === "test" &&
      password === "1234" &&
      confirmPassword === password
    ) {
      router.push("/dashboard");
    } else {
      alert("WOMP WOMP NO ACCOUNT FOR YOU");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex w-80 flex-col items-center">
        {/* Title */}
        <h1 className="font-display mb-4 block text-5xl leading-none text-lion md:text-8xl">
          sign up
        </h1>

        {/* Email */}
        <input
          type="text"
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

        {/* Retype Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 w-full rounded-full border px-4 py-2 focus:ring-2 focus:outline-none"
        />

        {/* Sign Up Button */}
        <div className="flex w-full">
          <button
            type="submit"
            className="mb-2 ml-auto cursor-pointer gap-2 rounded-full bg-blue px-4 py-2 font-medium transition"
          >
            sign up
          </button>
        </div>

        {/* Login Link */}
        <div className="w-full text-right text-xs">
          Already have an account?{" "}
          <Link href="/login" className="cursor-pointer">
            Login!
          </Link>
        </div>
      </form>
    </div>
  );
}
