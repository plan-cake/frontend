"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Banner } from "@/components/banner";
import LinkText from "@/components/link-text";
import PasswordCriteria from "@/features/auth/components/password-criteria";
import TextInputField from "@/features/auth/components/text-input-field";
import ActionButton from "@/features/button/components/action";
import { useToast } from "@/features/toast/context";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { formatApiError } from "@/lib/utils/api/handle-api-error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({});
  const router = useRouter();

  // TOASTS AND ERROR STATES
  const { addToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function passwordIsStrong() {
    return Object.keys(passwordCriteria).length === 0;
  }

  const handleEmailChange = (value: string) => {
    setErrors((prev) => ({ ...prev, email: "", api: "" }));
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setErrors((prev) => ({ ...prev, password: "", api: "" }));
    setPassword(value);
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
          addToast("error", "An error occurred. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        addToast("error", "An error occurred. Please try again.");
      });
  }, [password]);

  useEffect(() => {
    if (password.length === 0) {
      setPasswordCriteria({});
      return;
    }
  }, [password]);

  const stopRefresh = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!email) {
      handleErrors("email", "Missing email");
      return false;
    }
    if (!password) {
      handleErrors("password", "Missing password");
      return false;
    }
    if (!passwordIsStrong()) {
      handleErrors("password", "Password is not strong enough");
      return false;
    }
    if (confirmPassword !== password) {
      handleErrors("confirmPassword", "Passwords do not match");
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
          handleErrors(
            "rate_limit",
            errorMessage || "Too many attempts. Please try again later.",
          );
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
        <h1 className="font-display text-lion mb-4 block text-5xl leading-none md:text-8xl">
          register
        </h1>

        {/* Rate Limit Error */}
        {errors.rate_limit && (
          <Banner type="error" title="Woah! Slow down" className="mb-4 w-full">
            {errors.rate_limit}
          </Banner>
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
