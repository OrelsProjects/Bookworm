import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import StoreProvider from "./providers/StoreProvider";
import AuthProvider from "./providers/AuthProvider";
import NavigationProvider from "./providers/NavigationProvider";
import ThemeProvider from "./providers/ThemeProvider";
import { Metadata, Viewport } from "next";

const APP_NAME = "BookWiz";
const APP_DEFAULT_TITLE = "BookWiz";
const APP_TITLE_TEMPLATE = "%s - BookWiz";
const APP_DESCRIPTION =
  "With BookWiz you will find your next, personally tailored read.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

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

export const viewport: Viewport = {
  themeColor: "#1C2026",
};
