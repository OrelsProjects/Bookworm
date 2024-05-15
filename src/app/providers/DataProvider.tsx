"use client";

import React, { useEffect, useRef } from "react";
import {
  AuthStateType,
  selectAuth,
  setAllDataFetched,
} from "../../lib/features/auth/authSlice";
import useBook from "../../hooks/useBook";
import { Logger } from "@/src/logger";
import useBooksList from "../../hooks/useBooksList";
import useRecommendations from "../../hooks/useRecommendations";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";

interface DataProviderProps {
  children?: React.ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { loadUserBooks } = useBook();
  const { loadUserBooksLists } = useBooksList();
  const { loadUserRecommendations } = useRecommendations();
  const { user, state, allDataFetched } = useAppSelector(selectAuth);
  const loadingUserBooks = useRef<boolean>(false);

  useEffect(() => {
    const loadUserDataAsync = async () => {
      try {
        if (loadingUserBooks.current) return;
        axios.defaults.baseURL = window.location.origin;
        loadingUserBooks.current = true;
        const promises = [];
        if (user && state === AuthStateType.SIGNED_IN) {
          promises.push(loadUserBooksLists(user));
          promises.push(loadUserBooks(user));
        }
        await Promise.allSettled(promises);
        dispatch(setAllDataFetched());
      } catch (error: any) {
        Logger.error("Error loading user books", { error });
      } finally {
        loadingUserBooks.current = false;
      }
    };

    if (!allDataFetched) {
      loadUserDataAsync();
    }
  }, [state, user]);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        await loadUserRecommendations(user);
      } catch (error: any) {
        Logger.error("Error loading recommendations", { error });
      }
    };
    loadRecommendations();
  }, []);

  return <>{children}</>;
};

export default DataProvider;
