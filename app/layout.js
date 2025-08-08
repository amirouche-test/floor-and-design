import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import ServerHeaderWrapper from "@/components/ServerHeaderWrapper";
import ServerFooterWrapper from "@/components/ServerFooterWrapper";
import 'react-loading-skeleton/dist/skeleton.css'


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Floor & Design",
  description: "Une application de gestion et de design de sols",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ServerHeaderWrapper />
        <main>{children}</main>
        <ServerFooterWrapper />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
