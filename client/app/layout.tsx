import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";

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
    <html data-scroll-behavior="smooth" lang="de">
      <body>{children}</body>
    </html>
  );
}
