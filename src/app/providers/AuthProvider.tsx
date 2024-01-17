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
import axios from "axios";
import { IResponse } from "@/src/models/dto/response";
import toast from "react-hot-toast";

interface AuthProviderProps {
  children?: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, loadingState } = useSelector(selectAuth);
  const isLoadingUserFetch = useRef<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    if (isLoadingUserFetch.current) {
      return;
    }
    try {
      dispatch(
        setLoading({
          loading: true,
          message: "Welcome back! Just a moment, we're grabbbing your user :)",
        })
      );
      isLoadingUserFetch.current = true;
      // console.log("fetchUser");setExpectedRating
      const session = await fetchAuthSession();
      const user = new User(
        session.userSub ?? "",
        "",
        session?.tokens?.accessToken?.payload?.email?.toString() ??
          session?.tokens?.idToken?.payload?.email?.toString() ??
          "",
        session.tokens?.accessToken?.toString() ?? ""
      );
      debugger;
      const userResponse = await axios.post<IResponse<User>>(
        "/api/user/confirm",
        {
          data: user,
        }
      );
      const userWithDetails = userResponse.data.result;
      if (userWithDetails) {
        dispatch(setUser({ ...userWithDetails }));
      } else {
        dispatch(setUser({ ...user }));
        throw new Error("Failed to confirm user in db");
      }
    } catch (error: any) {
      Logger.error("Error fetching user", { error });
      toast.error("Error fetching user");
    } finally {
      dispatch(
        setLoading({
          loading: false,
          message: "",
        })
      );
      isLoadingUserFetch.current = false;
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
    dispatch(
      setLoading({
        loading: true,
        message: "We are looking for your user.. :)",
      })
    );
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          fetchUser();
          break;
        case "signInWithRedirect_failure":
          dispatch(setError("An error has occurred"));
          dispatch(setLoading({ loading: false }));
          break;
        case "signedIn":
          fetchUser();
          break;
        case "customOAuthState":
          //   setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
          dispatch(setLoading({ loading: false }));
          break;
      }
    });

    fetchUser();

    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (!loadingState.loading) {
      if (pathname === "/") {
        router.push("/home");
      }
    }
  }, [loadingState, pathname, router]);

  return loadingState.loading ? (
    <div className="w-full h-full flex justify-center items-center">
      <Loading
        spinnerClassName="!w-24 !h-24 !fill-primary"
        text={loadingState.message ?? ""}
      />
    </div>
  ) : (
    children
  );
};

export default AuthProvider;
