import HeaderSpacer from "@/app/ui/components/header/header-spacer";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col gap-4 pr-6 pl-6">
      <HeaderSpacer />

      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="flex h-full flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-4">
          <div className="h-10 w-40 rounded-3xl bg-gray-200 dark:bg-[#343249]" />
          <div className="h-10 w-40 rounded-3xl bg-gray-200 dark:bg-[#343249]" />
        </div>

        <div className="h-120 w-full rounded-3xl bg-gray-200 dark:bg-[#343249]" />
      </div>
    </div>
  );
}
