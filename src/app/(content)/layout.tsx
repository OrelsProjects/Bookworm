import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { ToastContainer, Slide } from "react-toastify";
import NavigationProvider from "../providers/NavigationProvider";
import Header from "../_components/header";
import APIProvider from "../providers/APIProvider";
import BrowserDetector from "../providers/BrowserDetector";
import ContentProvider from "../providers/ContentProvider";
import DataProvider from "../providers/DataProvider";


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
