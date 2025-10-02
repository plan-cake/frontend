"use client";

import { useRouter } from "next/navigation";
import MessagePage from "../../ui/layout/message-page";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const email = sessionStorage.getItem("sign_up_email");
  let lastEmailResend = Date.now();

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
    const emailResendCooldown = 30000; // 30 seconds
    let timeLeft =
      (emailResendCooldown - (Date.now() - lastEmailResend)) / 1000;
    timeLeft = Math.ceil(timeLeft);
    if (timeLeft > 0) {
      alert(`Slow down! ${timeLeft} seconds until you can send again.`);
      return;
    }
    // TODO: Replace with real resend email API logic
    console.log("Resending email to:", email);
    lastEmailResend = Date.now();
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
