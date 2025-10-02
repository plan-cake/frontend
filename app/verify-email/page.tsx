"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MessagePage from "../ui/layout/message-page";

export default function Page() {
  const [verifying, setVerifying] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("code");

  useEffect(() => {
    const verifyEmail = async () => {
      // simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!token) {
        setVerifying(false);
        setEmailVerified(false);
        return;
      }

      // TODO: Replace with an actual API call
      setVerifying(false);
      setEmailVerified(true);
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
