import { useRef, useState } from "react";

import {
  CheckIcon,
  Cross2Icon,
  ExitIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

import TextInputField from "@/components/text-input-field";
import { useAccount } from "@/features/account/context";
import AccountSettingsDrawer from "@/features/account/settings/drawer";
import AccountSettingsPopover from "@/features/account/settings/popover";
import ActionButton from "@/features/button/components/action";
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
  const [defaultNameError, setDefaultNameError] = useState("");

  const applyDefaultName = async () => {
    setDefaultNameError("");
    if (defaultName) {
      const res = await fetch("/api/account/set-default-name/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: defaultName }),
      });

      if (res.ok) {
        login({ ...accountDetails!, defaultName: defaultName });
        addToast("success", "Default name updated successfully.");
        return true;
      } else {
        setDefaultName(accountDetails?.defaultName || "");
        const errorData = await res.json();
        addToast("error", formatApiError(errorData));
        return false;
      }
    } else {
      const res = await fetch("/api/account/remove-default-name/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        login({ ...accountDetails!, defaultName: "" });
        setDefaultName("");
        addToast("success", "Default name removed successfully.");
        return true;
      } else {
        setDefaultName(accountDetails?.defaultName || "");
        const errorData = await res.json();
        addToast("error", formatApiError(errorData));
        return false;
      }
    }
  };

  const resetEdits = () => {
    setDefaultName(accountDetails?.defaultName || "");
    return true;
  };

  const handleDefaultNameChange = (value: string) => {
    if (value.length > 25) {
      setDefaultNameError("Max 25 characters.");
    } else {
      setDefaultNameError("");
      setDefaultName(value);
    }
  };

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

      <div className="frosted-glass-inset flex flex-col gap-2 rounded-3xl border-none p-4">
        <form className="flex gap-2">
          <TextInputField
            id="defaultName"
            label="Default Name"
            value={defaultName}
            type="text"
            onChange={(newValue) => {
              handleDefaultNameChange(newValue);
            }}
            error={defaultNameError}
            outlined
            classname="mb-0 text-foreground"
          />
          {defaultName !== (accountDetails?.defaultName || "") && (
            <>
              <ActionButton
                type="button"
                buttonStyle="secondary"
                icon={<Cross2Icon />}
                onClick={() => resetEdits()}
              />
              <ActionButton
                type="submit"
                buttonStyle={defaultName ? "primary" : "danger"}
                icon={defaultName ? <CheckIcon /> : <TrashIcon />}
                onClick={async () => await applyDefaultName()}
              />
            </>
          )}
        </form>
        <div className="text-sm leading-tight opacity-75">
          This name will be autofilled when filling out your availability.
          Change or remove it anytime!
        </div>
      </div>

      <div className="frosted-glass-inset rounded-3xl border-none">
        <button
          onClick={signOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-3xl p-4 text-sm transition-colors",
            "frosted-glass-button rounded-3xl text-left",
          )}
          aria-label="Sign out of your account"
        >
          <ExitIcon className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
