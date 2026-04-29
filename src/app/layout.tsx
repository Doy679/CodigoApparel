import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { CustomCursor } from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: "Codigo Street & Culture",
  description: "Authentic apparel for the culture.",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <CustomCursor />
        <main>{children}</main>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
