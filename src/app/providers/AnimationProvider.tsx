"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { OpacityDiv } from "@/src/components/animationDivs";

interface ProviderProps {
  children?: React.ReactNode;
}

const AnimationProvider: React.FC<ProviderProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <OpacityDiv key={pathname}>
      {children}
    </OpacityDiv>
  );
};

export default AnimationProvider;
