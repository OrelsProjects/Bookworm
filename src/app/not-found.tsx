"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const NotFound = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/home");
  }, []);

  return <></>;
};

export default NotFound;
