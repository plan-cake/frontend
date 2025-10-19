import HeaderSpacer from "@/app/ui/components/header/header-spacer";

export default function Loading() {
  return (
    <div className="flex animate-pulse flex-col space-y-4 pr-6 pl-6">
      <HeaderSpacer />

      <div className="flex w-full flex-wrap items-center justify-between md:flex-row">
        <div className="h-12 w-3/4 rounded-3xl bg-gray-200 md:w-1/2 dark:bg-[#343249]" />
        <div className="hidden h-10 w-50 rounded-full bg-gray-200 dark:bg-[#343249]" />
      </div>

      <div className="grid w-full grid-cols-1 grid-rows-[auto] gap-y-4 md:grow md:grid-cols-[200px_auto] md:grid-rows-[auto_auto] md:gap-x-4 md:gap-y-4">
        <div className="hidden h-20 rounded-3xl bg-gray-200 md:block dark:bg-[#343249]" />
        <div className="col-span-3 hidden h-20 rounded-3xl bg-gray-200 md:block dark:bg-[#343249]" />
        <div className="hidden h-20 rounded-3xl bg-gray-200 md:col-start-1 md:row-start-2 md:block dark:bg-[#343249]" />
        <div className="hidden h-120 rounded-3xl bg-gray-200 md:col-span-10 md:col-start-2 md:row-span-10 md:row-start-2 md:block dark:bg-[#343249]" />
        <div className="hidden h-60 rounded-3xl bg-gray-200 md:col-start-1 md:row-start-11 md:block dark:bg-[#343249]" />

        <div className="h-20 w-3/4 rounded-3xl bg-gray-200 md:hidden" />
        <div className="h-20 w-3/4 rounded-3xl bg-gray-200 md:hidden" />
        <div className="h-100 rounded-3xl bg-gray-200 md:hidden" />
      </div>
    </div>
  );
}
