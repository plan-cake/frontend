"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import RateLimitBanner from "@/components/banner/rate-limit";
import LinkText from "@/components/link-text";
import TextInputField from "@/components/text-input-field";
import PasswordCriteria from "@/features/auth/components/password-criteria";
import ActionButton from "@/features/button/components/action";
import { useFormErrors } from "@/lib/hooks/use-form-errors";
import { MESSAGES } from "@/lib/messages";
import { formatApiError } from "@/lib/utils/api/handle-api-error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({});
  const router = useRouter();

  // TOASTS AND ERROR STATES
  const { errors, handleError, clearAllErrors, handleGenericError } =
    useFormErrors();

  function passwordIsStrong() {
    return Object.keys(passwordCriteria).length === 0;
  }

  const handleEmailChange = (value: string) => {
    handleError("email", "");
    handleError("api", "");
    setEmail(value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    handleError("confirmPassword", "");
    handleError("api", "");
    setConfirmPassword(value);
  };

  const handlePasswordChange = useDebouncedCallback((password) => {
    if (errors.password) handleError("password", "");

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
          handleGenericError();
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        handleGenericError();
      });
  }, 300);

  const stopRefresh = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    clearAllErrors();

    if (!email) {
      handleError("email", MESSAGES.ERROR_EMAIL_MISSING);
      return false;
    }
    if (!password) {
      handleError("password", MESSAGES.ERROR_PASSWORD_MISSING);
      return false;
    }
    if (!passwordIsStrong()) {
      handleError("password", MESSAGES.ERROR_PASSWORD_WEAK);
      return false;
    }
    if (confirmPassword !== password) {
      handleError("confirmPassword", MESSAGES.ERROR_PASSWORD_MISMATCH);
      return false;
    }

    try {
      const res = await fetch("/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        sessionStorage.setItem("register_email", email);
        router.push("/register/email-sent");
        return true;
      } else {
        const body = await res.json();
        const errorMessage = formatApiError(body);

        if (res.status === 429) {
          handleError("rate_limit", errorMessage || MESSAGES.ERROR_RATE_LIMIT);
        } else if (errorMessage.includes("Email:")) {
          handleError("email", errorMessage.split("Email:")[1].trim());
        } else if (errorMessage.includes("Password:")) {
          handleError("password", errorMessage.split("Password:")[1].trim());
        } else {
          handleError("api", errorMessage);
        }
        return false;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      handleGenericError();
      return false;
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <form onSubmit={stopRefresh} className="flex w-80 flex-col items-center">
        {/* Title */}
        <h1 className="font-display text-lion mb-4 block text-5xl leading-none md:text-8xl">
          register
        </h1>

        {/* Rate Limit Error */}
        {errors.rate_limit && (
          <RateLimitBanner>{errors.rate_limit}</RateLimitBanner>
        )}

        {/* Email */}
        <TextInputField
          id={"email"}
          type="email"
          label="Email*"
          value={email}
          onChange={handleEmailChange}
          outlined
          error={errors.email || errors.api}
        />

        {/* Password */}
        <TextInputField
          id={"password"}
          type="password"
          label="Password*"
          value={password}
          onChange={(value) => {
            setPassword(value);
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

        {/* Register Button */}
        <div className="flex w-full justify-end">
          <ActionButton
            buttonStyle="primary"
            label="Register"
            onClick={handleSubmit}
            loadOnSuccess
          />
        </div>

        {/* Login Link */}
        <div className="mt-2 w-full text-right text-xs">
          Already have an account?{" "}
          <Link href="/login">
            <LinkText>Login!</LinkText>
          </Link>
        </div>
      </form>
    </div>
  );
}
