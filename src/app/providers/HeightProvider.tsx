"use client";

import React, { useEffect } from "react";

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

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerHeight]);

  return (
    <div
      className={`w-full h-full ${className}`}
      style={{ height: `${height}px` }}
    >
      {children}
    </div>
  );
}
