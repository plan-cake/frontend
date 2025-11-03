"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import LinkText from "@/components/link-text";
import PasswordCriteria from "@/features/auth/components/password-criteria";
import TextInputField from "@/features/auth/components/text-input-field";
import ActionButton from "@/features/button/components/action";
import { useDebounce } from "@/lib/hooks/use-debounce";
import formatApiError from "@/lib/utils/api/format-api-error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({});
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

  const stopRefresh = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!email) {
      alert("Missing email");
      return false;
    }
    if (!password) {
      alert("Missing password");
      return false;
    }
    if (!passwordIsStrong()) {
      alert("Password is not strong enough");
      return false;
    }
    if (confirmPassword !== password) {
      alert("Passwords do not match");
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
        <h1 className="font-display text-lion mb-4 block text-5xl leading-none md:text-8xl">
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
