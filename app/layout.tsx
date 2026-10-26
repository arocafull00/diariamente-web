import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next"

import { Background } from "@/components/background";
import { MotionProvider } from "@/components/motion/motion-provider";
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

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Diariamente",
  description: "Registro emocional diario para pacientes y psicólogos",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Diariamente",
  },
  icons: {
    icon: "/icon.png?v=5",
    shortcut: "/favicon.ico?v=5",
    apple: "/apple-touch-icon.png?v=5",
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
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
    <html
      lang="es"
      className={`${quicksand.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="relative min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <ClerkProvider>
          <Background />
          <MotionProvider>
            <div className="relative z-10 flex min-h-full flex-1 flex-col">
              {children}
            </div>
          </MotionProvider>
          <Toaster richColors position="top-center" />
          <ServiceWorkerRegister />
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
