"use client";

import React, { useContext, useEffect } from "react";
import SizeContext from "../../lib/context/sizeContext";
import BrowserContext from "../../lib/context/browserContext";
import BottomBarProvider from "./BottomBarProvider";
import { cn } from "../../lib/utils";

// this one calculates the height of the screen and sets it as max height
// for the children
export default function ContentProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const browser = useContext(BrowserContext);
  const [height, setHeight] = React.useState<number>(0);
  const [width, setWidth] = React.useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerHeight, window.innerWidth, window]);

  return (
    <SizeContext.Provider value={{ height, width }}>
      <div className="w-full" style={{ height: `${height}px` }}>
        <BottomBarProvider />
        <div
          className={cn("w-full h-full py-10 pb-16 px-7.5 flex flex-col z-10 tracking-semiwide relative overflow-clip", className, {
            "h-screen": browser === "safari",
          })}
          style={{ height: `${height}px` }}
        >
          {children}
        </div>
      </div>
    </SizeContext.Provider>
  );
}
