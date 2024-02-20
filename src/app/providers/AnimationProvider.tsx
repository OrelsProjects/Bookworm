"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
