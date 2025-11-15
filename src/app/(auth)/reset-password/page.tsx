"use client";

import React, { useState } from "react";

import { useRouter, useSearchParams, notFound } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import TextInputField from "@/components/text-input-field";
import PasswordCriteria from "@/features/auth/components/password-criteria";
import ActionButton from "@/features/button/components/action";
import { useToast } from "@/features/toast/context";
import { TOAST_MESSAGES } from "@/features/toast/messages";
import { formatApiError } from "@/lib/utils/api/handle-api-error";

export default function Page() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({});
  const router = useRouter();

  const searchParams = useSearchParams();
  const pwdResetToken = searchParams.get("token");
  if (!pwdResetToken) {
    notFound(); // If no token is provided, show 404 page
  }

  function passwordIsStrong() {
    return Object.keys(passwordCriteria).length === 0;
  }

  // TOASTS AND ERROR STATES
  const { addToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleConfirmPasswordChange = (value: string) => {
    setErrors((prev) => ({ ...prev, confirmPassword: "", api: "" }));
    setConfirmPassword(value);
  };

  const handleErrors = (field: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));

    if (field === "api") addToast("error", message);
  };

  const handlePasswordChange = useDebouncedCallback((password) => {
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));

    if (password.length === 0) {
      setPasswordCriteria({});
      return;
    }

    // Check that the password is strong enough with the API
    fetch("/api/auth/check-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
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
          addToast("error", TOAST_MESSAGES.ERROR_GENERIC);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        addToast("error", TOAST_MESSAGES.ERROR_GENERIC);
      });
  }, 300);

  const stopRefresh = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!newPassword) {
      handleErrors("password", TOAST_MESSAGES.ERROR_PASSWORD_MISSING);
      return false;
    }
    if (!passwordIsStrong()) {
      handleErrors("password", TOAST_MESSAGES.ERROR_PASSWORD_WEAK);
      return false;
    }
    if (newPassword !== confirmPassword) {
      handleErrors("confirmPassword", TOAST_MESSAGES.ERROR_PASSWORD_MISMATCH);
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
        const body = await res.json();
        const errorMessage = formatApiError(body);

        if (res.status === 404) {
          addToast("error", TOAST_MESSAGES.ERROR_GENERIC);
        } else if (body.error?.["new_password"]) {
          handleErrors("password", TOAST_MESSAGES.ERROR_PASSWORD_REUSE);
        } else {
          handleErrors("api", errorMessage);
        }
        return false;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      addToast("error", TOAST_MESSAGES.ERROR_GENERIC);
      return false;
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <form onSubmit={stopRefresh} className="flex w-80 flex-col items-center">
        {/* Title */}
        <h1 className="font-display text-lion mb-4 block text-center text-5xl leading-none md:text-8xl">
          reset password
        </h1>

        {/* New Password */}
        <TextInputField
          id={"password"}
          type="password"
          label="New Password*"
          value={newPassword}
          onChange={(value) => {
            setNewPassword(value);
            handlePasswordChange(value);
          }}
          outlined
          error={errors.password || errors.api}
        />

        {/* Password Errors */}
        {!passwordIsStrong() && (
          <div className="-mt-2 mb-2 w-full px-4">
            <PasswordCriteria criteria={passwordCriteria} />
          </div>
        )}

        {/* Retype Password */}
        <TextInputField
          id={"confirmPassword"}
          type="password"
          label="Retype Password*"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          outlined
          error={errors.confirmPassword || errors.api}
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
