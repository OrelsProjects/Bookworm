"use client";

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { AuthStateType, selectAuth } from "../../lib/features/auth/authSlice";
import useBook from "../../hooks/useBook";
import { Logger } from "@/src/logger";
import useBooksList from "../../hooks/useBooksList";
import useUserRecommendations from "../../hooks/useRecommendations";
import axios from "axios";

interface DataProviderProps {
  children?: React.ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { loadUserBooks } = useBook();
  const { loadUserBooksLists } = useBooksList();
  const { loadUserRecommendations } = useUserRecommendations();
  const { user, state } = useSelector(selectAuth);
  const loadingUserBooks = useRef<boolean>(false);
  const [dataLoaded, setDataLoaded] = React.useState(false);

  useEffect(() => {
    const loadUserDataAsync = async () => {
      try {
        if (loadingUserBooks.current) return;
        axios.defaults.baseURL = window.location.origin;
        loadingUserBooks.current = true;
        await Promise.allSettled([
          loadUserBooksLists(user),
          loadUserBooks(user),
          loadUserRecommendations(user),
        ]);
      } catch (error: any) {
        Logger.error("Error loading user books", { error });
      } finally {
        loadingUserBooks.current = false;
      }
    };

    if (state === AuthStateType.SIGNED_IN && user && !dataLoaded) {
      setDataLoaded(true);
      loadUserDataAsync();
    }
  }, [state, user]);

  return <>{children}</>;
};

export default DataProvider;
