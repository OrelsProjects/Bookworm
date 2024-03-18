"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AuthStateType, selectAuth } from "../../lib/features/auth/authSlice";
import { usePathname, useRouter } from "next/navigation";

interface NavigationProviderProps {
  children?: React.ReactNode;
}

const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, state } = useSelector(selectAuth);

  useEffect(() => {
    console.log(
      "window.history.state",
      window.history.state,
      "pathname",
      pathname
    );
    if (!user && state !== AuthStateType.SIGNED_IN) {
      const currentPathname = pathname;
      if (pathname !== "/login") {
        router.push("/login");
        if (!pathname.includes("/lists/")) {
          router.push(currentPathname);
        }
      }
    }
  }, [user, window.history.state, pathname]);

  return <>{children}</>;
};

export default NavigationProvider;
