"use client";
import { VersionHistoryData } from "@/features/version-history/type";

export default function ClientPage({
  versionHistoryData,
}: {
  versionHistoryData: VersionHistoryData;
}) {
  const fadeHeight = "h-8";

  return (
    <div className="mx-auto flex min-h-screen flex-col justify-end px-8">
      <div className="flex flex-col gap-4">
        <div className={fadeHeight} /> {/* Bottom spacer to avoid cutoff */}
        {versionHistoryData.map((version, index) => (
          <div>
            <div key={version.version} className="flex">
              <div className="relative w-20 flex-shrink-0">
                {index !== versionHistoryData.length - 1 && (
                  <div className="border-foreground text-background absolute left-[50%] top-4 z-0 h-[calc(100%+6px)] translate-x-[-50%] border-l-2" />
                )}
                <div className="bg-foreground text-background absolute left-[50%] z-10 mb-1 w-fit translate-x-[-50%] rounded-full">
                  <h2 className="text-md px-2 font-semibold">
                    {version.version}
                  </h2>
                </div>
              </div>
              <div>
                <ul className="relative left-10 list-disc space-y-2">
                  {version.changes
                    .concat(version.bugFixes ?? [])
                    .map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-background sticky bottom-0 pb-8">
        <h1 className="font-display text-lion mt-8 text-center text-7xl md:text-8xl">
          Version History
        </h1>
      </div>
    </div>
  );
}
