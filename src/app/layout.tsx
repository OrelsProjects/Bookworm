import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "./providers/StoreProvider";
import AuthProvider from "./providers/AuthProvider";
import React from "react";
import APIProvider from "./providers/APIProvider";
import { ToastContainer, Flip } from "react-toastify";
import DataProvider from "./providers/DataProvider";
import Header from "./_components/header";
import ModalProvider from "./providers/ModalProvider";
import BottomBarProvider from "./providers/BottomBarProvider";
import NavigationProvider from "./providers/NavigationProvider";
import ContentProvider from "./providers/ContentProvider";
import BrowserDetector from "./providers/BrowserDetector";

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
    <html lang="en">
      <meta property="og:image" content="<generated>" />
      <meta property="og:image:type" content="<generated>" />
      <meta property="og:image:width" content="<generated>" />
      <meta property="og:image:height" content="<generated>" />
      <body className={`${inter.className} overflow-clip`}>
        <StoreProvider>
          <AuthProvider>
            <NavigationProvider>
              <APIProvider>
                <DataProvider>
                  <ContentProvider>
                    <BrowserDetector>
                      <div className="w-full h-full font-roboto">
                        <Header className="h-fit w-fit" />
                        {/* <AnimationProvider> */}
                        {children}
                        <ToastContainer
                          stacked
                          theme="dark"
                          autoClose={2500}
                          draggablePercent={60}
                          className="!mb-16"
                          transition={Flip}
                        />
                        {/* </AnimationProvider> */}
                      </div>
                    </BrowserDetector>
                    <ModalProvider />
                  </ContentProvider>
                </DataProvider>
              </APIProvider>
            </NavigationProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
