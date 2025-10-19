import HeaderSpacer from "@/app/ui/components/header/header-spacer";

export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col space-y-4 pr-6 pl-6">
      <HeaderSpacer />

      <div className="flex w-full flex-wrap items-center justify-between md:flex-row">
        <div className="h-12 w-1/2 rounded-3xl bg-gray-200 dark:bg-gray-700" />

        <div className="h-10 w-50 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="mb-8 flex h-full flex-col gap-4 md:mb-0 md:flex-row">
        <div className="h-96 w-full rounded-3xl bg-gray-200 dark:bg-gray-700" />

        <div className="h-fit w-full shrink-0 space-y-4 overflow-y-auto md:w-80">
          <div className="hidden h-20 rounded-3xl bg-gray-200 md:block dark:bg-gray-700" />

          <div className="hidden h-70 rounded-3xl bg-gray-200 md:block dark:bg-gray-700" />
          <div className="h-20 rounded-3xl bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
