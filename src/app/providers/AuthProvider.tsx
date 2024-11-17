"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { useSession } from "next-auth/react";
import { setUser } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, status } = useSession();

  useEffect(() => {
    switch (status) {
      case "authenticated":
        if (data.user) {
          dispatch(
            setUser({
              userId: data.user.userId,
              email: data.user.email || "",
              displayName: data.user.name || "",
              profilePictureUrl: data.user.image || "",
            })
          );
        } else {
          dispatch(setUser(null));
        }
        break;
      case "unauthenticated":
        dispatch(setUser(null));
        // router.push("/login");
        break;
      default:
        break;
    }
  }, [status]);

  return children;
}
