import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import StoreProvider from "./providers/StoreProvider";
import { ToastContainer, Slide } from "react-toastify";
import Header from "./_components/header";
import APIProvider from "./providers/APIProvider";
import AuthProvider from "./providers/AuthProvider";
import BrowserDetector from "./providers/BrowserDetector";
import ContentProvider from "./providers/ContentProvider";
import DataProvider from "./providers/DataProvider";
import NavigationProvider from "./providers/NavigationProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="w-[100vw] h-[100vh] pb-[calc(max(env(safe-area-inset-bottom),16px)-16px)]">
        <StoreProvider>
          <AuthProvider>
            <NavigationProvider>{children}</NavigationProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
