"use client";

import React, { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import PasswordCriteria from "@/features/auth/components/password-criteria";
import TextInputField from "@/features/auth/components/text-input-field";
import ActionButton from "@/features/button/components/action";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { formatApiError } from "@/lib/utils/api/handle-api-error";

export default function Page() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({});
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

  const stopRefresh = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!pwdResetToken) {
      alert("This link is expired or invalid.");
      return false;
    }

    if (!newPassword) {
      alert("Missing new password.");
      return false;
    }
    if (!passwordIsStrong()) {
      alert("Password is not strong enough");
      return false;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }

    try {
      const res = await fetch("/api/auth/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reset_token: pwdResetToken,
          new_password: newPassword,
        }),
      });
      if (res.ok) {
        router.push("/reset-password/success");
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
        <h1 className="font-display text-lion mb-4 block text-center text-5xl leading-none md:text-8xl">
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
        <div className="flex w-full justify-end">
          <ActionButton
            buttonStyle="primary"
            label="Change Password"
            onClick={handleSubmit}
            loadOnSuccess
          />
        </div>
      </form>
    </div>
  );
}
