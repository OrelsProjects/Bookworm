import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import StoreProvider from "./providers/StoreProvider";
import AuthProvider from "./providers/AuthProvider";
import NavigationProvider from "./providers/NavigationProvider";
import ThemeProvider from "./providers/ThemeProvider";

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
            <NavigationProvider>
              <ThemeProvider>
                {/* <AnimationProvider> */}
                {children}
                {/* </AnimationProvider> */}
              </ThemeProvider>
            </NavigationProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
