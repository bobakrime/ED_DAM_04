import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Importar.info - Calculadora de Importación de Coches",
  description: "Calcula el precio final de importar tu coche de Alemania a España. Incluye impuestos, matriculación, transporte y todos los gastos.",
  keywords: ["importar coche", "alemania", "españa", "calculadora", "impuestos", "matriculación", "mobile.de"],
  authors: [{ name: "Importar.info" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Importar.info - Calculadora de Importación de Coches",
    description: "Calcula el precio final de importar tu coche de Alemania a España.",
    url: "https://importar.info",
    siteName: "Importar.info",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Importar.info",
    description: "Calculadora de importación de coches desde Alemania",
  },
};

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />

        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
