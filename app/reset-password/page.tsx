"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

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

    // TODO: Replace with real password reset API call
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
    } else {
      router.push("/reset-password/success");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex w-80 flex-col items-center">
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
    </div>
  );
}
