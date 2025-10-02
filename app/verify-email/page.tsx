"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [verifying, setVerifying] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("code");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerifying(false);
        setEmailVerified(false);
        return;
      }

      // TODO: Replace with an actual API call
      // randomly choose an outcome after a delay for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const success = Math.random() > 0.5;
      setVerifying(false);
      setEmailVerified(success);
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex h-screen items-center justify-center">
      {verifying ? (
        <div className="text-center">
          <h2 className="mb-6">Verifying...</h2>
        </div>
      ) : emailVerified ? (
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold">Email Verified</h2>
          <p className="mb-6">Welcome to Plancake!</p>
          <div className="flex justify-center gap-6">
            <Link
              href="/login"
              className="mb-2 cursor-pointer gap-2 rounded-full bg-blue px-4 py-2 font-medium transition"
            >
              go to login
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold">Failed to Verify Email</h2>
          <p className="mb-6">This link is invalid or has expired.</p>
          <div className="flex justify-center gap-6">
            <Link
              href="/sign-up"
              className="mb-2 cursor-pointer gap-2 rounded-full bg-blue px-4 py-2 font-medium transition"
            >
              back to sign up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
