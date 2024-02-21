import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "./providers/StoreProvider";
import AuthProvider from "./providers/AuthProvider";
import React from "react";
import "./globals.css";
import APIProvider from "./providers/APIProvider";
import { Toaster } from "react-hot-toast";
import DataProvider from "./providers/DataProvider";
import AnimationProvider from "./providers/AnimationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Bookworm",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col overflow-hidden overscroll-none`}
      >
        <StoreProvider>
          <AuthProvider>
            <APIProvider>
              <DataProvider>
                <AnimationProvider>
                  <div className="!font-sans">{children}</div>
                </AnimationProvider>
                <Toaster />
              </DataProvider>
            </APIProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
