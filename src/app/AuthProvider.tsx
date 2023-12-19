"use client";

import React, { useEffect, createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  selectAuth,
  setUser,
  setLoading,
  setError,
} from "../lib/features/auth/authSlice"; // Adjust the import path as necessary
import { Amplify } from "aws-amplify";
import { fetchAuthSession, getCurrentUser, decodeJWT } from "aws-amplify/auth";
import { convert as convertUser } from "../models/converters/userConverter";
import { Hub } from "aws-amplify/utils";
import awsConfig from "../amplifyconfiguration.json";

Amplify.configure(awsConfig);

interface AuthProviderProps {
  children?: React.ReactNode;
}

const AuthContext = createContext<AuthProviderProps>({});

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, loading, error } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const authSession = await fetchAuthSession();
      const user = convertUser(authSession);
      dispatch(setUser({ ...user }));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    dispatch(setLoading(true));
    // dispatch(setLoading(false)); // For faster testing
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          fetchUser();
          break;
        case "signInWithRedirect_failure":
          dispatch(setError("An error has occurred"));
          dispatch(setLoading(false));
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
      {loading ? <div>Loading...</div> : error ? <div>{error}</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
