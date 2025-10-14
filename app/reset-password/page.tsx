"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import formatApiError from "../_utils/format-api-error";
import { useDebounce } from "../_lib/use-debounce";
import PasswordCriteria from "../ui/components/auth/password-criteria";
import TextInputField from "../ui/components/auth/text-input-field";

export default function Page() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({});
  const isSubmitting = useRef(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const pwdResetToken = searchParams.get("token");

  function passwordIsStrong() {
    return Object.keys(passwordCriteria).length === 0;
  }

  useDebounce(() => {
    if (newPassword.length === 0) {
      setPasswordCriteria({});
      return;
    }

    // Check that the password is strong enough with the API
    fetch("/api/auth/check-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            if (data.is_strong) {
              setPasswordCriteria({});
              return;
            } else {
              setPasswordCriteria(data.criteria || {});
            }
          });
        } else {
          console.error("Fetch error:", res.status);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, [newPassword]);

  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordCriteria({});
      return;
    }
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting.current) return;
    isSubmitting.current = true;

    if (!pwdResetToken) {
      alert("This link is expired or invalid.");
      isSubmitting.current = false;
      return;
    }

    if (!newPassword) {
      alert("Missing new password.");
      isSubmitting.current = false;
      return;
    }
    if (!passwordIsStrong()) {
      alert("Password is not strong enough");
      isSubmitting.current = false;
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      isSubmitting.current = false;
      return;
    }
    await fetch("/api/auth/reset-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reset_token: pwdResetToken,
        new_password: newPassword,
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          router.push("/reset-password/success");
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
        <h1 className="font-display mb-4 block text-center text-5xl leading-none text-lion md:text-8xl">
          reset password
        </h1>

        {/* New Password */}
        <TextInputField
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={setNewPassword}
        />

        {!passwordIsStrong() && (
          <div className="-mt-2 mb-2 w-full px-4">
            <PasswordCriteria criteria={passwordCriteria} />
          </div>
        )}

        {/* Confirm Password */}
        <TextInputField
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
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
