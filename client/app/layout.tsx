import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "Stefans Fitness-Kompass",
    template: "%s | Stefans Fitness-Kompass",
  },
  description:
    "Ein deutschsprachiger Fitness-Kompass zu Ernährung, Training, Gesundheit, Alltag und Quellenbewertung.",
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
