import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "./ui/layout/header";
import { Providers } from "./_utils/providers";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} m-12 h-dvh antialiased md:h-fit`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
