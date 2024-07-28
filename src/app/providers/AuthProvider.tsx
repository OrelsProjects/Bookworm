"use client";

import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAuth,
  setUser,
  setLoading,
  setError,
} from "../../lib/features/auth/authSlice";
import { fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import "../../amplifyconfiguration";
import Loading from "../../components/ui/loading";
import { initEventTracker, setUserEventTracker } from "../../eventTracker";

import { Logger, initLogger, setUserLogger } from "@/src/logger";
import axios from "axios";
import { IResponse } from "@/src/models/dto/response";
import { CreateUser } from "@/src/models/user";
import { Router } from "lucide-react";

interface AuthProviderProps {
  children?: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, loadingState } = useSelector(selectAuth);
  const isLoadingUserFetch = useRef<boolean>(false);
  const dispatch = useDispatch();

  const fetchUserLocal = () => {
    const userStringified = localStorage.getItem("user") ?? null;
    if (userStringified) {
      const user = JSON.parse(userStringified);
      dispatch(setUser(user));
    }
    dispatch(
      setLoading({
        loading: false,
      })
    );
  };

  const fetchUser = async () => {
    if (isLoadingUserFetch.current) {
      return;
    }
    try {
      if (!user) {
        // If user was not set from local storage, show loading screen
        dispatch(
          setLoading({
            loading: true,
            message: "Hi there!\nJust a moment, we're grabbing your user :)",
          })
        );
        isLoadingUserFetch.current = true;
      }

      const session = await fetchAuthSession();
      const userId = session.userSub ?? "";
      const email =
        session?.tokens?.accessToken?.payload?.email?.toString() ??
        session?.tokens?.idToken?.payload?.email?.toString() ??
        "";
      const token = session?.tokens?.accessToken?.toString() ?? "";
      const profilePictureUrl =
        session?.tokens?.idToken?.payload?.picture?.toString() ?? "";
      const displayName =
        session?.tokens?.idToken?.payload?.name?.toString() ?? "";
      const createUser: CreateUser = {
        userId,
        email,
        profilePictureUrl,
        displayName,
      };
      const fromList = localStorage.getItem("listReferer");
      localStorage.removeItem("listReferer");
      const userResponse = await axios.post<IResponse<CreateUser>>(
        "/api/user/confirm",
        {
          data: { user: createUser, fromList },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userWithDetails = userResponse.data.result;
      if (userWithDetails) {
        dispatch(setUser({ ...userWithDetails, token }));
        localStorage.setItem("user", JSON.stringify(userWithDetails));
      } else {
        dispatch(setUser({ ...createUser, token }));
        throw new Error("Failed to confirm user in db");
      }
    } catch (error: any) {
      localStorage.removeItem("user");
      Logger.error("Error fetching user", { error });
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
          break;
      }
    });
    fetchUserLocal();

    return unsubscribe;
  }, []);

  return loadingState.loading ? (
    <div className="absolute w-screen h-screen top-0 bottom-0 right-0 left-0">
      <Loading spinnerClassName="w-20 h-20" text={loadingState.message ?? ""} />
    </div>
  ) : (
    children
  );
};

export default AuthProvider;
