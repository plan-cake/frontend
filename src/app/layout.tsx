import type { Metadata } from "next";
import { Modak, Nunito } from "next/font/google";

import Header from "@/components/header/header";
import { Providers } from "@/lib/providers";
import "@/styles/globals.css";

const modak = Modak({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-modak",
  display: "swap",
});

const nunito = Nunito({
  weight: ["200", "300", "400", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plancake",
  description: "Stacking up perfect plans, one pancake at a time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Theme transition classes - ONLY backgrounds and borders (no text color)
  const themeTransitionClasses = [
    // Background and border transitions only
    "[&_*]:transition-[background-color,border-color]",
    "[&_*]:duration-[1200ms]",
    "[&_*]:ease-in-out",

    // Faster transitions for user interactions
    "[&_*:hover]:duration-150",
    "[&_*:active]:duration-150",
    "[&_*:focus-visible]:duration-150",

    // Instant transitions for specific elements
    "[&_[data-slot-iso]]:transition-none",
    "[&_[class*=animate-]]:transition-none",
    "[&_[data-state]]:transition-none",

    // SVG icon transitions
    "[&_svg]:transition-[fill,stroke]",
    "[&_svg_*]:transition-[fill,stroke]",
  ].join(" ");

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${modak.variable} ${nunito.variable} ${themeTransitionClasses}`}
    >
      <body className="font-sans antialiased !transition-[background-color] !duration-[1200ms] !ease-in-out">
        <div className="mx-auto flex min-h-dvh max-w-[1440px] flex-col">
          <Providers>
            <Header />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
