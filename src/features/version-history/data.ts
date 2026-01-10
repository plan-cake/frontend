import { VersionHistoryData } from "@/features/version-history/type";

export function getVersionHistoryData(): VersionHistoryData {
    return [
        {
            version: "v0.1",
            date: new Date(2025, 9, 19),
            changes: ["Initial beta release"],
            minorVersions: [
                {
                    version: "v0.1.1",
                    date: new Date(2025, 9, 22),
                    changes: [
                        "Fixed broken redirect after event creation",
                        "Fixed event editing error preventing updates",
                    ],
                },
                {
                    version: "v0.1.2",
                    date: new Date(2025, 10, 2),
                    changes: [
                        "Updated all buttons on the site to be more responsive",
                        "Fixed an issue where painting the grid up to midnight would fill entire days",
                        "Fixed event grid time display in different time zones",
                        "Fixed an issue where remaining toasts would not disappear after dismissing one",
                    ],
                },
            ],
        },
    ];
}

export function getCurrentVersion(): string {
    const history = getVersionHistoryData();
    const latestMajor = history[history.length - 1];
    if (latestMajor.minorVersions && latestMajor.minorVersions.length > 0) {
        return latestMajor.minorVersions[latestMajor.minorVersions.length - 1].version;
    }
    return `${latestMajor.version}.0`;
}
