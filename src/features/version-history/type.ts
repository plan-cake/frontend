type MajorVersionNumber = `v${number}.${number}`;
type MinorVersionNumber = `${MajorVersionNumber}.${number}`;

type VersionData = {
    version: MajorVersionNumber;
    date: Date;
    changes: string[];
    bugFixes?: string[];
    minorVersions?: {
        version: MinorVersionNumber;
        date: Date;
        changes: string[];
    }[];
};

export type VersionHistoryData = VersionData[];