import HeaderSpacer from "@/components/header-spacer";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col gap-4 pl-6 pr-6">
      <HeaderSpacer />

      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="flex h-full flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-4">
          <div className="bg-loading h-10 w-40 rounded-3xl" />
          <div className="bg-loading h-10 w-40 rounded-3xl" />
        </div>

        <div className="h-120 bg-loading w-full rounded-3xl" />
      </div>
    </div>
  );
}
