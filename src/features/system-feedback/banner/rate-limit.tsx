import { Banner } from "@/features/system-feedback/banner/base";

export default function RateLimitBanner({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Banner type="error" title="Woah! Slow down" className="mb-4 w-full">
      {children}
    </Banner>
  );
}
