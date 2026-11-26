import type { Metadata } from "next";
import "./globals.css";
import { business } from "@/config/business";

export const metadata: Metadata = {
  metadataBase: new URL("https://krishnabuildingmaterial.in"),
  title: {
    default: `${business.name} | ${business.tagline}`,
    template: `%s | ${business.name}`,
  },
  description: business.description,
  icons: {
    icon: "/images/img2.png",
    shortcut: "/images/img2.png",
    apple: "/images/img2.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: business.name,
    title: `${business.name} | ${business.tagline}`,
    description: business.description,
    images: [
      {
        url: "/images/img2.png",
        width: 1239,
        height: 1269,
        alt: `${business.name} storefront`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} | ${business.tagline}`,
    description: business.description,
    images: ["/images/img2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
