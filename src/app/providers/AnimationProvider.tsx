"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { OpacityDiv } from "@/src/components/animationDivs";

interface ProviderProps {
  children?: React.ReactNode;
}

const AnimationProvider: React.FC<ProviderProps> = ({ children }) => {
  const previousPathame = useRef<string>("");
  const pathname = usePathname();

  useEffect(() => {
    if (previousPathame.current !== pathname) {
      previousPathame.current = pathname;
    }
  }, []);
  
  console.log(pathname);
  return (
    <OpacityDiv
      // opacityKey={pathname === "/" ? "root" : pathname}
      // isOpen={pathname !== previousPathame.current}
    >
      {children}
    </OpacityDiv>
  );
};

export default AnimationProvider;
