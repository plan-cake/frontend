import { DashboardIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function DashboardButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/dashboard")}
      className="frosted-glass flex cursor-pointer items-center justify-center rounded-full p-2"
      aria-label="Go to Dashboard"
    >
      <DashboardIcon className="h-5 w-5" />
    </button>
  );
}
