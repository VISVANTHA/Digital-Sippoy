import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital-Sippoy",
  description: "Testbed reference app for the Testable code-scanning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}