"use client";

import React, { useEffect } from "react";
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
import {
  init as initEventTracker,
  setUser as setUserEventTracker,
} from "../../eventTracker";

interface AuthProviderProps {
  children?: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, loading } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      dispatch(setLoading(true));
      console.log("fetchUser");
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
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    initEventTracker();
  }, []);

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
    console.log("I am loading for pathname");
    if (!loading) {
      if (pathname === "/") {
        router.push("/home");
      }
    }
  }, [loading, router]);

  useEffect(() => {
    if (user) {
      setUserEventTracker(user?.id);
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loading className="!w-24 !h-24" />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default AuthProvider;
