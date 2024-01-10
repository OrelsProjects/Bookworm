"use client";

import React, { useEffect, createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  selectAuth,
  setUser,
  setLoading,
  setError,
} from "../lib/features/auth/authSlice";
import { fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { User } from "../models";
import "../amplifyconfiguration";
import { Loading } from "../components";

interface AuthProviderProps {
  children?: React.ReactNode;
}

const AuthContext = createContext<AuthProviderProps>({});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, loading, error } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchUser = async () => {
    try {
      dispatch(setLoading(true));
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
    dispatch(setLoading(true));
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
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
      if (!user) {
        router.push("/home");
      }
    }
  }, [loading, user, router]);

  return (
    <AuthContext.Provider value={{}}>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loading className="!w-24 !h-24" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
