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
import BottomBarProvider from "./providers/BottomBarProvider";
import NavigationProvider from "./providers/NavigationProvider";
import HeightProvider from "./providers/HeightProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // manifest: "/manifest.json",
  title: "BookWizard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}`}
      >
        <StoreProvider>
          <AuthProvider>
            <NavigationProvider>
              <APIProvider>
                <DataProvider>
                  <AnimationProvider>
                    <HeightProvider className="p-4 pt-12 flex flex-col">
                      {children}
                    </HeightProvider>
                  </AnimationProvider>
                  <Header className="h-9 w-full p-4 pb-2" />
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
