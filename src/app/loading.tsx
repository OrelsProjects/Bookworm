"use client";

import React, { useContext, useEffect } from "react";
import Loading from "../components/ui/loading";
import SizeContext from "../lib/context/sizeContext";

const LoadingMyLibrary = ({ params }: { params?: { listUrl?: string } }) => {
  const { width, height } = useContext(SizeContext);

  return (
    <div
      className="absolute w-screen h-[100vh] top-0 bottom-0 right-0 left-0 z-[60]"
      style={{ width, height }}
    >
      <Loading spinnerClassName="w-20 h-20" />
    </div>
  );
};

export default LoadingMyLibrary;
