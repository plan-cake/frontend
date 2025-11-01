"use client";

import MessagePage from "@/components/layout/message-page";
import LinkButton from "@/features/button/components/link-button";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <MessagePage
        title="Password Reset Successful"
        buttons={[
          <LinkButton
            key="0"
            buttonStyle="primary"
            label="Back to Login"
            href="/login"
          />,
        ]}
      />
    </div>
  );
}
