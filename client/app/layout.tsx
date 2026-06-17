import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import {
  ogImage,
  ogImageHeight,
  ogImageType,
  ogImageWidth,
  siteName,
  siteUrl,
} from "@/lib/site";

const sourceSans = Source_Sans_3({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-source-sans",
});

const sourceSerif = Source_Serif_4({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-source-serif",
});

const plexMono = IBM_Plex_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

const description =
  "Ein deutschsprachiger Fitness-Kompass zu Ernährung, Training, Gesundheit, Alltag und Quellenbewertung.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description,
    locale: "de_DE",
    images: [
      {
        url: ogImage,
        width: ogImageWidth,
        height: ogImageHeight,
        type: ogImageType,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: [ogImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${sourceSans.variable} ${sourceSerif.variable} ${plexMono.variable}`}
      data-scroll-behavior="smooth"
      lang="de"
    >
      <body>{children}</body>
    </html>
  );
}
