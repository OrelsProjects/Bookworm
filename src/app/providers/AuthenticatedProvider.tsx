"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AuthStateType, selectAuth } from "../../lib/features/auth/authSlice";
import { useRouter } from "next/navigation";

// Use this in the layout to force the user to be authenticated
export default function AuthenticatedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { state } = useSelector(selectAuth);

  useEffect(() => {
    if (state !== AuthStateType.SIGNED_IN) {
      router.push("/home");
    }
  }, [state]);

  if (state === AuthStateType.SIGNED_IN) {
    return children;
  }
}
