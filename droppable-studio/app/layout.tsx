import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import DropCanvas from "@/components/DropCanvas";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

/* Self-hosted Apple Garamond Italic — the brand's secondary voice */
const appleGaramond = localFont({
  src: "./fonts/AppleGaramond-Italic.ttf",
  style: "italic",
  weight: "400",
  variable: "--font-garamond",
  display: "swap",
});

/* Self-hosted SF Pro Text for non-Apple platforms; Apple devices hit the
   native "-apple-system" / "SF Pro Text" entries earlier in the stack. */
const sfPro = localFont({
  src: "./fonts/SF-Pro-Text-Regular.otf",
  variable: "--font-sf-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Droppable Studio — AI Ads That Stop the Scroll",
  description:
    "Droppable Studio is an AI marketing agency creating high-end, scroll-stopping AI ads for skincare, fashion, real estate, music and global brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${appleGaramond.variable} ${sfPro.variable}`}
    >
      <body>
        <DropCanvas />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
