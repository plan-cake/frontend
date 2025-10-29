"use client";

import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import MessagePage from "@/components/layout/message-page";

export default function Page() {
  const [verifying, setVerifying] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("code");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerifying(false);
        setEmailVerified(false);
        return;
      }

      await fetch("/api/auth/verify-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verification_code: token }),
      })
        .then(async (res) => {
          if (res.ok) {
            setEmailVerified(true);
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          alert("An error occurred. Please try again.");
        });

      setVerifying(false);
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
        <MessagePage
          title="Email Verified"
          description="Welcome to Plancake!"
          buttons={[
            {
              type: "primary",
              label: "go to login",
              onClick: () => router.push("/login"),
            },
          ]}
        />
      ) : (
        <MessagePage
          title="Failed to Verify Email"
          description="This link is invalid or has expired."
          buttons={[
            {
              type: "secondary",
              label: "back to register",
              onClick: () => router.push("/register"),
            },
          ]}
        />
      )}
    </div>
  );
}
