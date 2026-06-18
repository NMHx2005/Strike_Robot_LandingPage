import type { Metadata } from "next";
import { Golos_Text, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const golosText = Golos_Text({
  subsets: ["latin"],
  variable: "--font-golos-text",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600"],
});

const superGround = localFont({
  src: "../../public/font/SuperGround-L3XZ4.ttf",
  variable: "--font-super-ground",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${golosText.variable} ${jetbrainsMono.variable} ${superGround.variable}`}
    >
      <body className="bg-transparent text-text font-body antialiased min-h-screen">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
