"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const NotFound = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/explore");
  }, []);

  return <></>;
};

export default NotFound;
