import { useEffect, useState } from "react";

export function formatLabel(tz: string): string {
  try {
    const now = new Date();
    const offset =
      new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "shortOffset",
      })
        .formatToParts(now)
        .find((p) => p.type === "timeZoneName")?.value || "";

    // Try to normalize to GMT+/-HH:MM
    const match = offset.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);
    const hours = match?.[1] ?? "0";
    const minutes = match?.[2] ?? "00";
    const fullOffset = `GMT${hours}:${minutes}`;

    const city = tz.split("/").slice(-1)[0].replaceAll("_", " ");
    return `${city} (${fullOffset})`;
  } catch {
    return tz;
  }
}

function buildGroupedTimezones() {
  const groups: Record<string, { label: string; value: string }[]> = {};
  const timezones = Intl.supportedValuesOf("timeZone");

  for (const tz of timezones) {
    const [region = "Other"] = tz.split("/");
    const label = formatLabel(tz);
    if (!groups[region]) groups[region] = [];
    groups[region].push({ label, value: tz });
  }

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([region, options]) => ({
      label: region,
      options: options.sort((a, b) => a.label.localeCompare(b.label)),
    }));
}

export default function TimezoneFileGenerator() {
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    const grouped = buildGroupedTimezones();
    const fileContent =
      "// Auto-generated timezone list\nexport const groupedTimezones = " +
      JSON.stringify(grouped, null, 2) +
      ";\n";
    setOutput(fileContent);
  }, []);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Timezone List Generator</h2>
      <textarea
        value={output}
        readOnly
        rows={25}
        className="w-full rounded border p-2 font-mono text-sm"
      />
      <button
        onClick={() => {
          const blob = new Blob([output], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "grouped-timezones.ts";
          a.click();
        }}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Download grouped-timezones.ts
      </button>
    </div>
  );
}
