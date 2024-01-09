"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface ProviderProps {
  children?: React.ReactNode;
}

const AnimationProvider: React.FC<ProviderProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial="initialState"
      animate="animateState"
      exit="exitState"
      transition={{
        duration: 0.5,
      }}
      variants={{
        initialState: {
          opacity: 0,
        },
        animateState: {
          opacity: 1,
        },
        exitState: {
          opacity: 0,
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimationProvider;
