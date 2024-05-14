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
      <body>
      <StoreProvider>
      <AuthProvider>
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
                  <div className="w-full h-full font-roboto">
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
      </AuthProvider>
    </StoreProvider>
      </body>
    </html>
  );
}
