"use client";

import React, { useEffect, useState } from "react";

import { useRouter, useSearchParams, notFound } from "next/navigation";

import PasswordCriteria from "@/features/auth/components/password-criteria";
import TextInputField from "@/features/auth/components/text-input-field";
import ActionButton from "@/features/button/components/action";
import { useToast } from "@/features/toast/context";
import { useDebounce } from "@/lib/hooks/use-debounce";
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

  const handlePasswordChange = (value: string) => {
    setErrors((prev) => ({ ...prev, password: "", api: "" }));
    setNewPassword(value);
  };

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
          addToast("error", "An error occurred. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        addToast("error", "An error occurred. Please try again.");
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
    setErrors({});

    if (!newPassword) {
      handleErrors("password", "Missing new password");
      return false;
    }
    if (!passwordIsStrong()) {
      handleErrors("password", "Password is not strong enough.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      handleErrors("confirmPassword", "Passwords do not match.");
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
          addToast("error", "An error occurred. Please try again.");
        } else if (body.error["new_password"]) {
          handleErrors("password", "Cannot reuse old password.");
        } else {
          handleErrors("api", errorMessage);
        }
        return false;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      addToast("error", "An error occurred. Please try again.");
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
          onChange={handlePasswordChange}
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
