"use client";

import { useRouter } from "next/navigation";
import MessagePage from "../../ui/layout/message-page";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const email = sessionStorage.getItem("sign_up_email");

  useEffect(() => {
    if (!email) {
      // the user shouldn't be here
      router.push("/login");
    }
    // clear the email from storage
    sessionStorage.removeItem("sign_up_email");
  }, []);

  if (!email) {
    // stop rendering if there's no email
    return null;
  }

  const handleResendEmail = () => {
    console.log("Resending email to:", email);
    // TODO: Replace with real resend email API logic
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <MessagePage
        title="Check your email"
        description={`A verification link was sent to ${email}.`}
        buttons={[
          {
            type: "secondary",
            label: "resend email",
            onClick: handleResendEmail,
          },
          {
            type: "primary",
            label: "go to login",
            onClick: () => router.push("/login"),
          },
        ]}
      />
    </div>
  );
}
