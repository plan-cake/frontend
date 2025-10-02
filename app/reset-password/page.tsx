"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordReset, setPasswordReset] = useState(false);

  const searchParams = useSearchParams();
  const pwdResetToken = searchParams.get("token");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pwdResetToken) {
      alert("Invalid or missing password reset token.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    // TODO: Replace with real sign up information
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
    } else {
      setPasswordReset(true);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {passwordReset ? (
        <div className="text-center">
          <h2 className="mb-6 text-4xl font-bold">Password Reset Successful</h2>
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

          {/* New Password */}
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-4 w-full rounded-full border px-4 py-2 focus:ring-2 focus:outline-none"
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4 w-full rounded-full border px-4 py-2 focus:ring-2 focus:outline-none"
          />

          {/* Change Password Button */}
          <div className="flex w-full">
            <button
              type="submit"
              className="mb-2 ml-auto cursor-pointer gap-2 rounded-full bg-blue px-4 py-2 font-medium transition"
            >
              reset password
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
