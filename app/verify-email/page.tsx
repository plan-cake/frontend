"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import MessagePage from "../ui/components/message-page";

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
              label: "back to sign up",
              onClick: () => router.push("/sign-up"),
            },
          ]}
        />
      )}
    </div>
  );
}
