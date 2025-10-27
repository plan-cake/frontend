"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import LinkText from "@/components/link-text";
import PasswordCriteria from "@/features/auth/components/password-criteria";
import TextInputField from "@/features/auth/components/text-input-field";
import { useDebounce } from "@/lib/hooks/use-debounce";
import formatApiError from "@/lib/utils/api/format-api-error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({});
  const isSubmitting = React.useRef(false);
  const router = useRouter();

  function passwordIsStrong() {
    return Object.keys(passwordCriteria).length === 0;
  }

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
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, [password]);

  useEffect(() => {
    if (password.length === 0) {
      setPasswordCriteria({});
      return;
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting.current) return;
    isSubmitting.current = true;

    if (!email) {
      alert("Missing email");
      isSubmitting.current = false;
      return;
    }
    if (!password) {
      alert("Missing password");
      isSubmitting.current = false;
      return;
    }
    if (!passwordIsStrong()) {
      alert("Password is not strong enough");
      isSubmitting.current = false;
      return;
    }
    if (confirmPassword !== password) {
      alert("Passwords do not match");
      isSubmitting.current = false;
      return;
    }

    await fetch("/api/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        if (res.ok) {
          sessionStorage.setItem("register_email", email);
          router.push("/register/email-sent");
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
        <h1 className="font-display mb-4 block text-5xl leading-none text-lion md:text-8xl">
          register
        </h1>

        {/* Email */}
        <TextInputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={setEmail}
        />

        {/* Password */}
        <TextInputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
        />

        {/* Password Errors */}
        {!passwordIsStrong() && (
          <div className="-mt-2 mb-2 w-full px-4">
            <PasswordCriteria criteria={passwordCriteria} />
          </div>
        )}

        {/* Retype Password */}
        <TextInputField
          type="password"
          placeholder="Retype Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        {/* Register Button */}
        <div className="flex w-full">
          <button
            type="submit"
            className="bg-blue dark:bg-red mb-2 ml-auto cursor-pointer gap-2 rounded-full px-4 py-2 font-medium text-white transition"
          >
            Register
          </button>
        </div>

        {/* Login Link */}
        <div className="w-full text-right text-xs">
          Already have an account?{" "}
          <Link href="/login">
            <LinkText>Login!</LinkText>
          </Link>
        </div>
      </form>
    </div>
  );
}
