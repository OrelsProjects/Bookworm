import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { ToastContainer, Slide } from "react-toastify";
import StoreProvider from "../providers/StoreProvider";
import NavigationProvider from "../providers/NavigationProvider";
import AuthProvider from "../providers/AuthProvider";
import Header from "../_components/header";
import APIProvider from "../providers/APIProvider";
import BrowserDetector from "../providers/BrowserDetector";
import ContentProvider from "../providers/ContentProvider";
import DataProvider from "../providers/DataProvider";
import AnimationProvider from "../providers/AnimationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // manifest: "/manifest.json",
  title: "BookWiz",
  openGraph: {
    title: "BookWiz",
    description: "BookWiz",
    type: "website",
    locale: "en_US",
    url: "https://www.bookwiz.app",
    siteName: "BookWiz",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <APIProvider>
        <DataProvider>
          <ToastContainer
            stacked
            theme="dark"
            autoClose={2500}
            draggablePercent={60}
            className="!mb-16 z-50"
            transition={Slide}
          />
          <ContentProvider>
            <BrowserDetector>
              <div className="w-full h-full font-roboto overflow-auto md:overflow-viible">
                <Header className="h-fit w-fit" />
                {/* <AnimationProvider> */}
                {children}
                {/* </AnimationProvider> */}
              </div>
            </BrowserDetector>
          </ContentProvider>
        </DataProvider>
      </APIProvider>
    </NavigationProvider>
  );
}
