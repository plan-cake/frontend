import { useRef, useState } from "react";

import { TrashIcon, ExitIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import TextInputField from "@/components/text-input-field";
import { useAccount } from "@/features/account/context";
import AccountSettingsDrawer from "@/features/account/settings/drawer";
import AccountSettingsPopover from "@/features/account/settings/popover";
import { useToast } from "@/features/system-feedback";
import useCheckMobile from "@/lib/hooks/use-check-mobile";
import { MESSAGES } from "@/lib/messages";
import { formatApiError } from "@/lib/utils/api/handle-api-error";
import { cn } from "@/lib/utils/classname";

export default function AccountSettings({
  children,
  open,
  setOpenChange,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpenChange: (open: boolean) => void;
}) {
  const isMobile = useCheckMobile();

  if (isMobile) {
    return (
      <AccountSettingsDrawer
        content={<SettingsContent />}
        open={open}
        setOpen={setOpenChange}
      >
        {children}
      </AccountSettingsDrawer>
    );
  }

  return (
    <AccountSettingsPopover
      content={<SettingsContent />}
      open={open}
      setOpen={setOpenChange}
    >
      {children}
    </AccountSettingsPopover>
  );
}

function SettingsContent() {
  const isSubmitting = useRef(false);
  const { login, logout, accountDetails } = useAccount();
  const router = useRouter();

  const [defaultName, setDefaultName] = useState(
    accountDetails?.defaultName || "",
  );

  const handleDefaultNameChange = useDebouncedCallback(async (name: string) => {
    try {
      if (name) {
        await fetch("/api/account/set-default-name/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_name: name }),
        });
      } else {
        await fetch("/api/account/remove-default-name/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      }

      if (accountDetails) {
        login({ ...accountDetails, defaultName: name });
      }

      addToast("success", "Profile updated successfully");
    } catch (err) {
      console.error("Fetch error:", err);
      addToast("error", MESSAGES.ERROR_GENERIC);
      setDefaultName(accountDetails?.defaultName || "");
    }
  }, 600);

  // TOASTS AND ERROR STATES
  const { addToast } = useToast();

  const signOut = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    await fetch("/api/auth/logout/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (res.ok) {
          logout();
          addToast("success", MESSAGES.SUCCESS_LOGOUT);
          router.push("/login");
        } else {
          addToast("error", formatApiError(await res.json()));
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        addToast("error", MESSAGES.ERROR_GENERIC);
      });

    isSubmitting.current = false;
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <h2 className="text-foreground text-center font-bold">
        {accountDetails?.email}
      </h2>

      <div className="frosted-glass-inset flex gap-2 rounded-3xl border-none p-4">
        <TextInputField
          id="displayName"
          label="Display Name"
          value={defaultName}
          type="text"
          onChange={(newValue) => {
            setDefaultName(newValue);
            handleDefaultNameChange(newValue);
          }}
          outlined
          classname="mb-0 text-foreground"
        />
        <button
          onClick={() => {
            setDefaultName("");
            handleDefaultNameChange("");
          }}
          className="frosted-glass-error-button text-red cursor-pointer rounded-full p-2 text-sm font-semibold hover:text-white"
          aria-label="Remove self"
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="frosted-glass-inset rounded-3xl border-none">
        <button
          onClick={signOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-3xl p-4 text-sm transition-colors",
            "frosted-glass-button rounded-3xl text-left",
          )}
        >
          <ExitIcon className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
