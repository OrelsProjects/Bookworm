import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "./StoreProvider";
import AuthProvider from "./AuthProvider";
import React from "react";
import "./globals.css";
import Header from "./_components/header";
import { VideoBackground } from "../components";
import APIProvider from "./APIProvider";
import { Toaster } from "react-hot-toast";
import DataProvider from "./DataProvider";

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
      <body
        className={`${inter.className} w-screen h-screen px-16 py-8 flex flex-col overflow-hidden overscroll-none sm:overscroll-auto`}
      >
        <StoreProvider>
          <AuthProvider>
            <APIProvider>
              <DataProvider>
                <div
                  id="portal"
                  className="absolute top-0 right-0 left-0 bottom-0 z-10"
                />
                <Header className="absolute top-0 mb-12" />
                <div className="absolute top-0 right-0 left-0 bottom-0 z-0">
                  <VideoBackground />
                </div>
                <div className="h-full w-full z-10 relative">{children}</div>
                <Toaster />
              </DataProvider>
            </APIProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
