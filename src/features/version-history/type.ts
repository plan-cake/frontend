type MajorVersionNumber = `v${number}.${number}`;
type MinorVersionNumber = `${MajorVersionNumber}.${number}`;

export type MinorVersionData = {
    version: MinorVersionNumber;
    date: Date;
    changes: string[];
};

export type MajorVersionData = {
    version: MajorVersionNumber;
    date: Date;
    changes: string[];
    bugFixes?: string[];
    minorVersions?: MinorVersionData[];
};

export type VersionHistoryData = MajorVersionData[];