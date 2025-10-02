"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter an email address.");
      return;
    }
    setEmailSent(true);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {emailSent ? (
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold">Check your email</h2>
          <p className="mb-6">
            A password reset link was sent to{" "}
            <span className="font-bold">{email}</span>.
          </p>
          <Link
            href="/login"
            className="mb-2 cursor-pointer gap-2 rounded-full bg-blue px-4 py-2 font-medium transition"
          >
            back to login
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-80 flex-col items-center"
        >
          {/* Title */}
          <h1 className="font-display mb-4 block text-center text-5xl leading-none text-lion md:text-8xl">
            reset password
          </h1>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-full border px-4 py-2 focus:ring-2 focus:outline-none"
          />

          <div className="flex w-full items-center justify-between">
            {/* Forgot Password */}
            <Link href="/login" className="mb-8 text-xs">
              Remembered password?
            </Link>

            {/* Email Button */}
            <button
              type="submit"
              className="mb-2 cursor-pointer gap-2 rounded-full bg-blue px-4 py-2 font-medium transition"
            >
              send reset link
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
