"use client";

import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  selectAuth,
  setUser,
  setLoading,
  setError,
} from "../../lib/features/auth/authSlice";
import { fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { User } from "../../models";
import "../../amplifyconfiguration";
import { Loading } from "../../components";
import { initEventTracker, setUserEventTracker } from "../../eventTracker";

import { Logger, initLogger, setUserLogger } from "@/src/logger";

interface AuthProviderProps {
  children?: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, loading } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Workaround for when the website won't load
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUser = async () => {
    try {
      dispatch(setLoading(true));
      // console.log("fetchUser");
      const session = await fetchAuthSession();
      const user = new User(
        session.userSub ?? "",
        "",
        session?.tokens?.accessToken?.payload?.email?.toString() ??
          session?.tokens?.idToken?.payload?.email?.toString() ??
          "",
        session.tokens?.accessToken?.toString() ?? ""
      );
      dispatch(setUser({ ...user }));
    } catch (error: any) {
      Logger.error("Error fetching user", { error });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    initEventTracker();
    initLogger();
  }, []);

  useEffect(() => {
    setUserEventTracker(user);
    setUserLogger(user);
  }, [user]);

  useEffect(() => {
    dispatch(setLoading(true));
    console.log("I am loading for Hub");
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      console.log("A new auth event has happened: ", JSON.stringify(payload));
      setLoading(false);
      switch (payload.event) {
        case "signInWithRedirect":
          fetchUser();
          break;
        case "signInWithRedirect_failure":
          dispatch(setError("An error has occurred"));
          dispatch(setLoading(false));
          break;
        case "signedIn":
          fetchUser();
          break;
        case "customOAuthState":
          //   setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
          dispatch(setLoading(false));
          break;
      }
    });

    fetchUser();

    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (pathname === "/") {
        router.push("/home");
      }
    } else {
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          fetchUser();
        }, 6000);
      }
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, pathname, router]);

  return loading ? (
    <div className="w-full h-full flex justify-center items-center">
      <Loading innerClassName="!w-24 !h-24 !fill-primary" />
    </div>
  ) : (
    children
  );
};

export default AuthProvider;
