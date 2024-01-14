import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "./providers/StoreProvider";
import AuthProvider from "./providers/AuthProvider";
import React from "react";
import "./globals.css";
import Header from "../components/header";
import { VideoBackground } from "../components";
import APIProvider from "./providers/APIProvider";
import { Toaster } from "react-hot-toast";
import DataProvider from "./providers/DataProvider";
import ModalProvider from "./providers/ModalProvider";
import AnimationProvider from "./providers/AnimationProvider";

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
                <div className="absolute top-0 left-0 right-0 bottom-0 w-screen h-screen">
                  <ModalProvider />
                </div>
                <div
                  id="portal"
                  className="absolute top-0 right-0 left-0 bottom-0 z-10"
                />
                <Header className="absolute top-0 mb-10" />
                <div className="absolute top-0 right-0 left-0 bottom-0 z-0">
                  <VideoBackground />
                </div>
                <AnimationProvider>
                  <div className="h-full w-full z-10 relative !font-sans">
                    {children}
                  </div>
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
