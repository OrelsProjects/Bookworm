"use client";

import React, { useEffect } from "react";
import { userAgent } from "next/server";
import BrowserContext, { Browser } from "../../lib/context/browserContext";

export default function BrowserDetector({
  children,
}: {
  children: React.ReactNode;
}) {
  const [browser, setBrowser] = React.useState<Browser>("unknown");
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("safari") !== -1) {
      if (userAgent.indexOf("chrome") !== -1) {
        setBrowser("chrome");
      } else {
        setBrowser("safari");
      }
    } else if (userAgent.indexOf("firefox") !== -1) {
      setBrowser("firefox");
    } else if (userAgent.indexOf("edge") !== -1) {
      setBrowser("edge");
    } else if (userAgent.indexOf("opera") !== -1) {
      setBrowser("opera");
    } else if (userAgent.indexOf("msie") !== -1) {
      setBrowser("ie");
    } else {
      setBrowser("unknown");
    }
  }, [userAgent]);

  return (
    <BrowserContext.Provider value={browser}>
      {children}
    </BrowserContext.Provider>
  );
}
