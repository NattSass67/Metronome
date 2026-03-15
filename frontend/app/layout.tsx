import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider, ThemeToggle } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "Rhythm Trainer";
const defaultTitle = `${siteName} | Programmable Metronome for Musicians`;
const defaultDescription =
  "Free programmable metronome for timing and subdivision practice. Set BPM, time signature, and step grid. Tap tempo, presets, and keyboard shortcuts. No sign-up.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://metronome.natt-sass.info"),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "metronome",
    "rhythm trainer",
    "BPM",
    "tempo",
    "time signature",
    "subdivision",
    "practice",
    "musician",
    "click track",
    "beat",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: defaultTitle,
    description: defaultDescription,
    siteName,
    url: "https://metronome.natt-sass.info",
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: defaultDescription,
    site: "@natt_sass", // optionally include twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    description: defaultDescription,
    applicationCategory: "MusicApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
