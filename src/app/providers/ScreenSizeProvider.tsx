"use client";

import React, { useContext, useEffect } from "react";
import BrowserContext from "../../lib/context/browserContext";
import SizeContext from "../../lib/context/sizeContext";

export default function ScreenSizeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const browser = useContext(BrowserContext);
  const [height, setHeight] = React.useState<number>(0);
  const [width, setWidth] = React.useState<number>(0);

  useEffect(() => {
    if (!window) return;
    const handleResize = () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [window?.innerHeight, window?.innerWidth, window]);

  return (
    <SizeContext.Provider value={{ height, width }}>
      <div
        style={{
          height: `${height}px`,
          width: `${width}px`,
        }}
      >
        {children}
      </div>
    </SizeContext.Provider>
  );
}
