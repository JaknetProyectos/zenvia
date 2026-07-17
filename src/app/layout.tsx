import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

export const metadata: Metadata = {
  metadataBase: new URL("https://zenvia.com.mx"),

  title: {
    default: "Zenvia | Insumos Médicos en México",
    template: "%s | Zenvia",
  },

  description:
    "Zenvia es una tienda especializada en la venta de insumos médicos, material clínico, equipo médico y productos para profesionales de la salud en México.",

  keywords: [
    "insumos médicos",
    "material médico",
    "equipo médico",
    "productos médicos",
    "dispositivos médicos",
    "suministros médicos",
    "material clínico",
    "equipo clínico",
    "hospitales",
    "consultorios médicos",
    "Zenvia",
    "zenvia.com.mx",
    "venta de insumos médicos",
    "insumos médicos México",
  ],

  authors: [
    {
      name: "Zenvia",
      url: "https://zenvia.com.mx",
    },
  ],

  creator: "Zenvia",
  publisher: "Zenvia",

  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://zenvia.com.mx",
    siteName: "Zenvia",
    title: "Zenvia | Insumos Médicos en México",
    description:
      "Venta de insumos médicos, material clínico y equipo médico para hospitales, clínicas y profesionales de la salud.",
    images: [
      {
        url: "https://zenvia.com.mx/logo.png",
        width: 1200,
        height: 630,
        alt: "Zenvia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Zenvia | Insumos Médicos",
    description:
      "Venta de insumos médicos, material clínico y equipo médico en México.",
    images: ["https://zenvia.com.mx/logo.png"],
  },


  alternates: {
    canonical: "https://zenvia.com.mx",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  category: "medical",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}>
      <head>

      </head>
      <body>
        {children}
      </body>
    </html>
  );
}