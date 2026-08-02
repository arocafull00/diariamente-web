import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next"

import { Background } from "@/components/background";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const quicksand = localFont({
  variable: "--font-quicksand",
  src: [
    {
      path: "../public/fonts/Quicksand-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Quicksand-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Quicksand-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Quicksand-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Quicksand-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "DiariaMente",
  description: "Registro emocional diario para pacientes y psicólogos",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DiariaMente",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="es"
        className={`${quicksand.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body
          className="relative min-h-full flex flex-col"
          suppressHydrationWarning
        >
          <Background />
          <div className="relative z-10 flex min-h-full flex-1 flex-col">
            {children}
          </div>
          <Toaster richColors position="top-center" />
          <ServiceWorkerRegister />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
