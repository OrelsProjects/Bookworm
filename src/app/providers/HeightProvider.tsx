"use client";

import React, { useEffect } from "react";
import SizeContext from "../../lib/context/sizeContext";

// this one calculates the height of the screen and sets it as max height
// for the children
export default function HeightProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
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
      <div
        className={`w-full h-full ${className}`}
        style={{ height: `${height}px` }}
      >
        {children}
      </div>
    </SizeContext.Provider>
  );
}
