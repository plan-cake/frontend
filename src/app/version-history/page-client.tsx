"use client";
import { useEffect, useState } from "react";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import * as Collapsible from "@radix-ui/react-collapsible";

import HeaderSpacer from "@/components/header-spacer";
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
  // On load, scroll to the bottom
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-end">
      <div className="max-w-200 mx-auto flex w-full flex-col gap-8 px-8">
        <HeaderSpacer scrollable />
        {versionHistoryData.map((version, index) => {
          const isCurrent = index === versionHistoryData.length - 1;
          const hasMinorVersions =
            version.minorVersions && version.minorVersions.length > 0;

          return (
            <div
              className={
                isCurrent ? "bg-panel outline-panel outline-16 rounded-xl" : ""
              }
              key={version.version}
            >
              <MajorVersion
                key={version.version}
                versionData={version}
                isCurrent={isCurrent}
                isLast={isCurrent && !hasMinorVersions}
                extendLine={!isCurrent && !hasMinorVersions}
              />
              {version.minorVersions &&
                version.minorVersions.map((minorVersion, minorIndex) => {
                  const isLastMinor =
                    minorIndex === version.minorVersions!.length - 1;

                  return (
                    <MinorVersion
                      key={minorVersion.version}
                      versionData={minorVersion}
                      isCurrent={isCurrent}
                      isLast={isCurrent && isLastMinor}
                      extendLine={!isCurrent && isLastMinor}
                    />
                  );
                })}
            </div>
          );
        })}
        {/* Bottom spacer to avoid fade cutoff */}
        <div />
      </div>
      <div className="sticky bottom-0 z-20">
        <div className="from-background bottom-0 left-0 h-8 w-full bg-gradient-to-t to-transparent" />
        <div className="bg-background flex justify-center pb-4">
          <h1 className="font-display text-lion mt-2 px-8 text-center text-6xl md:mt-4 md:text-8xl">
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
  extend,
}: {
  version?: string;
  isCurrent: boolean;
  isLast: boolean;
  extend: boolean;
}) {
  return (
    <div className="relative w-10 flex-shrink-0">
      {!isLast && (
        <div
          className={cn(
            "absolute left-[50%] top-4 z-0 h-[calc(100%+6px)] translate-x-[-50%] border-l-2",
            isCurrent ? "border-accent" : "border-foreground",
            extend ? "h-[calc(100%+6px+12px)]" : "",
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
          <h2 className="text-md px-2 font-bold">{version}</h2>
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
  extendLine,
}: {
  versionData: MajorVersionData;
  isCurrent: boolean;
  isLast: boolean;
  extendLine: boolean;
}) {
  const releaseDate = versionData.date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex">
      <TimelineSegment
        version={versionData.version}
        isCurrent={isCurrent}
        isLast={isLast}
        extend={extendLine}
      />
      <div className="px-4">
        <span className="text-foreground/50 italic">{releaseDate}</span>
        <ul>
          {versionData.changes.map((change) => (
            <li key={change}>- {change}</li>
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
  extendLine,
}: {
  versionData: MinorVersionData;
  isCurrent: boolean;
  isLast: boolean;
  extendLine: boolean;
}) {
  const [open, setOpen] = useState(false);

  const releaseDate = versionData.date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mt-4 flex">
      <TimelineSegment
        isCurrent={isCurrent}
        isLast={isLast}
        extend={extendLine}
      />
      <div className="px-4">
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger asChild className="cursor-pointer">
            <div className="group flex items-center gap-2">
              <span className="font-bold">{versionData.version}</span>
              <span className="text-foreground/50 italic">{releaseDate}</span>
              <ChevronRightIcon
                className={cn(
                  "h-6 w-6 transition-transform duration-200",
                  "group-hover:bg-accent/25 group-active:bg-accent/40 rounded-full p-1",
                  open && "rotate-90",
                )}
              />
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content className="collapsible-content">
            <ul>
              {versionData.changes.map((change) => (
                <li key={change}>- {change}</li>
              ))}
            </ul>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  );
}
