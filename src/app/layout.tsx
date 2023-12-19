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
        className={`${inter.className} px-16 py-8  overflow-hidden overscroll-none sm:overscroll-auto`}
      >
        <StoreProvider>
          <AuthProvider>
            <APIProvider>
              <Header className="mb-20" />
              <div className="absolute top-0 right-0 left-0 bottom-0 z-0">
                <VideoBackground />
              </div>
              <div className="h-screen v-screen z-10">{children}</div>
              <Toaster
                toastOptions={{
                  style: {
                    // Card color or variable named --card
                    background: "var(--background)",
                    color: "#fff",
                  },
                }}
              />
            </APIProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
