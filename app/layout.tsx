import type { Metadata } from "next";
import { Modak, Nunito } from "next/font/google";
import Header from "./ui/layout/header";
import { Providers } from "./_lib/providers";
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
  title: "tomeeto",
  description: "to meet or not to meet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${modak.variable} ${nunito.variable}`}
    >
      <body className="font-sans antialiased">
        <div className="flex min-h-dvh flex-col p-10">
          <Providers>
            <Header />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
