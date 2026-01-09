"use client";

import { Fragment } from "react";

import {
  MajorVersionData,
  MinorVersionData,
  VersionHistoryData,
} from "@/features/version-history/type";
import { cn } from "@/lib/utils/classname";

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
          <Fragment key={version.version}>
            <MajorVersion
              key={version.version}
              versionData={version}
              isCurrent={index === versionHistoryData.length - 1}
              isLast={
                index === versionHistoryData.length - 1 &&
                (!version.minorVersions || version.minorVersions.length === 0)
              }
            />
            {version.minorVersions &&
              version.minorVersions.map((minorVersion, minorIndex) => (
                <MinorVersion
                  key={minorVersion.version}
                  versionData={minorVersion}
                  isCurrent={index === versionHistoryData.length - 1}
                  isLast={
                    index === versionHistoryData.length - 1 &&
                    minorIndex === version.minorVersions!.length - 1
                  }
                />
              ))}
          </Fragment>
        ))}
      </div>
      <div className="sticky bottom-0 z-20">
        <div
          className={cn(
            fadeHeight,
            "from-background bottom-0 left-0 w-full bg-gradient-to-t to-transparent",
          )}
        />
        <div className="bg-background flex pb-8">
          <h1 className="font-display text-lion mt-4 text-center text-7xl md:text-8xl">
            Version History
          </h1>
        </div>
      </div>
    </div>
  );
}

function TimelineSegment({
  version,
  isCurrent,
  isLast,
}: {
  version?: string;
  isCurrent: boolean;
  isLast: boolean;
}) {
  return (
    <div className="relative w-20 flex-shrink-0">
      {!isLast && (
        <div
          className={cn(
            "absolute left-[50%] top-4 z-0 h-[calc(100%+6px)] translate-x-[-50%] border-l-2",
            isCurrent ? "border-accent" : "border-foreground",
          )}
        />
      )}
      {version ? (
        <div
          className={cn(
            "text-background absolute left-[50%] z-10 mb-1 w-fit translate-x-[-50%] rounded-full",
            isCurrent ? "bg-accent text-white" : "bg-foreground",
          )}
        >
          <h2 className="text-md px-2 font-semibold">{version}</h2>
        </div>
      ) : (
        <div
          className={cn(
            "absolute left-[50%] z-10 mt-1.5 h-3 w-3 translate-x-[-50%] rounded-full",
            isCurrent ? "bg-accent" : "bg-foreground",
          )}
        ></div>
      )}
    </div>
  );
}

function MajorVersion({
  versionData,
  isCurrent,
  isLast,
}: {
  versionData: MajorVersionData;
  isCurrent: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex">
      <TimelineSegment
        version={versionData.version}
        isCurrent={isCurrent}
        isLast={isLast}
      />
      <div>
        <ul className="relative left-6 list-disc space-y-2">
          {versionData.changes
            .concat(versionData.bugFixes ?? [])
            .map((change) => (
              <li key={change}>{change}</li>
            ))}
        </ul>
      </div>
    </div>
  );
}

function MinorVersion({
  versionData,
  isCurrent,
  isLast,
}: {
  versionData: MinorVersionData;
  isCurrent: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex">
      <TimelineSegment isCurrent={isCurrent} isLast={isLast} />
      <div>
        <ul className="relative left-6 list-disc space-y-2">
          {versionData.changes.map((change) => (
            <li key={change}>{change}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
