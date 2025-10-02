"use client";

import { useRouter } from "next/navigation";
import MessagePage from "../../ui/components/message-page";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center">
      <MessagePage
        title="Password Reset Successful"
        buttons={[
          {
            type: "primary",
            label: "back to login",
            onClick: () => router.push("/login"),
          },
        ]}
      />
    </div>
  );
}
