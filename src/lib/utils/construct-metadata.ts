import { Metadata } from "next";

export function constructMetadata(
  title: string,
  description: string,
): Metadata {
  const fullTitle = `${title} • Plancake`;

  return {
    title: fullTitle,
    description: description,
    openGraph: {
      title: fullTitle,
      description: description,
      type: "website",
      siteName: "Plancake",
      locale: "en_US",
    },
  };
}
