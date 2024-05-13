import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import StoreProvider from "./providers/StoreProvider";
import ScreenSizeProvider from "./providers/ScreenSizeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ScreenSizeProvider>{children}</ScreenSizeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
