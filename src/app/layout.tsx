import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Sinhala } from "next/font/google"; // [MODIFY]
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansSinhala = Noto_Sans_Sinhala({ // [NEW]
  variable: "--font-noto-sans-sinhala",
  subsets: ["sinhala"],
});

export const metadata: Metadata = {
  title: "Particle Hand Tracker",
  description: "Interactive 3D particle visualization controlled by hand gestures using MediaPipe and Three.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansSinhala.variable} antialiased`} // [MODIFY]
      >
        {children}
      </body>
    </html>
  );
}
