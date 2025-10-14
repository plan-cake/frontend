"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import formatApiError from "../_utils/format-api-error";
import TextInputField from "../ui/components/auth/text-input-field";
import { useDebounce } from "../_lib/use-debounce";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const isSubmitting = React.useRef(false);
  const router = useRouter();

  useDebounce(() => {
    if (password.length === 0) {
      setPasswordErrors([]);
      return;
    }

    // Check that the password is strong enough with the API
    fetch("/api/auth/check-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then((res) => {
        console.log(res.status);
        if (res.ok) {
          setPasswordErrors([]);
        } else {
          res.json().then((data) => {
            if (data && data.error && data.error.password) {
              setPasswordErrors(data.error.password);
            }
          });
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
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
    if (passwordErrors.length > 0) {
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
        {passwordErrors.length > 0 && (
          <div className="-mt-2 mb-2 w-full px-4 text-sm">
            <b>Your password must:</b>
            {passwordErrors.map((error, index) => (
              <div key={index}>
                {/* NOT A HACK I PROMISE, the message format is just consistent */}
                - {error.substring(14).substring(0, error.length - 15)}
              </div>
            ))}
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
            className="mb-2 ml-auto cursor-pointer gap-2 rounded-full bg-blue px-4 py-2 font-medium transition"
          >
            register
          </button>
        </div>

        {/* Login Link */}
        <div className="w-full text-right text-xs">
          Already have an account?{" "}
          <Link href="/login" className="cursor-pointer">
            Login!
          </Link>
        </div>
      </form>
    </div>
  );
}
