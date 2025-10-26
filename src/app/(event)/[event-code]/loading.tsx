import HeaderSpacer from "@/components/header-spacer";

export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col space-y-4 pl-6 pr-6">
      <HeaderSpacer />

      <div className="flex w-full flex-wrap items-center justify-between md:flex-row">
        <div className="h-12 w-1/2 rounded-3xl bg-gray-200 dark:bg-[#343249]" />

        <div className="w-50 h-10 rounded-full bg-gray-200 dark:bg-[#343249]" />
      </div>

      <div className="mb-8 flex h-full flex-col gap-4 md:mb-0 md:flex-row">
        <div className="h-96 w-full rounded-3xl bg-gray-200 dark:bg-[#343249]" />

        <div className="h-fit w-full shrink-0 space-y-4 overflow-y-auto md:w-80">
          <div className="hidden h-20 rounded-3xl bg-gray-200 dark:bg-[#343249] md:block" />

          <div className="h-70 hidden rounded-3xl bg-gray-200 dark:bg-[#343249] md:block" />
          <div className="h-20 rounded-3xl bg-gray-200 dark:bg-[#343249]" />
        </div>
      </div>
    </div>
  );
}
