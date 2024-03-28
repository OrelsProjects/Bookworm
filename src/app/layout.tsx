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
import BrowserDetector from "./providers/BrowserDetector";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // manifest: "/manifest.json",
  title: "BookWiz",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-clip`}>
        <StoreProvider>
          <AuthProvider>
            <NavigationProvider>
              <APIProvider>
                <DataProvider>
                  <BrowserDetector>
                    <HeightProvider className=" py-10 px-7.5 flex flex-col z-20 tracking-semiwide relative overflow-clip">
                      <div className="w-full h-full overflow-auto scrollbar-hide font-roboto">
                        <Header className="h-fit w-fit" />
                        <AnimationProvider>{children}</AnimationProvider>
                      </div>
                      <ModalProvider />
                    </HeightProvider>
                  </BrowserDetector>
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
