"use client";

import React, { useContext, useEffect } from "react";
import SizeContext from "../../lib/context/sizeContext";
import BrowserContext from "../../lib/context/browserContext";
import BottomBarProvider from "./BottomBarProvider";
import { cn } from "../../lib/utils";
import ModalProvider from "./ModalProvider";
import ScreenSizeProvider from "./ScreenSizeProvider";
import { useAppSelector } from "../../lib/hooks";

// this one calculates the height of the screen and sets it as max height
// for the children
export default function ContentProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { user } = useAppSelector((state) => state.auth);
  const browser = useContext(BrowserContext);

  return (
    <ScreenSizeProvider>
      <div className="w-full h-full scrollbar-hide md:scrollbar-visible">
        <ModalProvider />
        <BottomBarProvider />
        <div
          className={cn(
            "w-full h-full py-10 pb-16 px-7.5 flex flex-col z-10 tracking-semiwide relative overflow-clip",
            { "md:px-72": user },
            className,
            {
              "h-screen": browser === "safari",
            }
          )}
        >
          {children}
        </div>
      </div>
    </ScreenSizeProvider>
  );
}
