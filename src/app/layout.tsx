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
import Header from "./_components/header";
import ModalProvider from "./providers/ModalProvider";
import BottomBar from "../components/bottomBar/bottomBar";
import BottomBarProvider from "./providers/BottomBarProvider";
import NavigationProvider from "./providers/NavigationProvider";

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
            <NavigationProvider>
              <APIProvider>
                <DataProvider>
                  <AnimationProvider>
                    <div className="!font-sans w-full h-full flex flex-col justify-center items-center p-4">
                      <Header className="pb-3" />
                      {children}
                    </div>
                  </AnimationProvider>
                  <ModalProvider />
                  <BottomBarProvider />
                  <Toaster />
                </DataProvider>
              </APIProvider>
            </NavigationProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
