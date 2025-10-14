import type { Metadata } from "next";
import { Modak, Nunito } from "next/font/google";
import Header from "./ui/components/header/header";
import { Providers } from "@/app/_lib/providers";
import "./globals.css";

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
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${modak.variable} ${nunito.variable}`}
    >
      <body className="font-sans antialiased">
        <div className="flex min-h-dvh flex-col">
          <Providers>
            <Header />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
