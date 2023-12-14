import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "./StoreProvider";
import AuthProvider from "./AuthProvider";
import React from "react";
import "./globals.css";
import Header from "./_components/header";
import { VideoBackground } from "../components";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookworm",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} px-16 py-8`}>
        <StoreProvider>
          <AuthProvider>
            <Header
            className="mb-20"
             />
            <div className="absolute top-0 right-0 left-0 bottom-0 z-0">
              <VideoBackground />
            </div>
            {children}
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
