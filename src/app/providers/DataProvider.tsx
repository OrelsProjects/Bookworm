"use client";

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { AuthStateType, selectAuth } from "../../lib/features/auth/authSlice";
import useBook from "../../hooks/useBook";
import { Logger } from "@/src/logger";

interface DataProviderProps {
  children?: React.ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { loadUserBooks } = useBook();
  const { user, state } = useSelector(selectAuth);
  const loadingUserBooks = useRef<boolean>(false);

  useEffect(() => {
    const loadUserBooksAsync = async () => {
      try {
        if (loadingUserBooks.current) return;
        loadingUserBooks.current = true;
        await loadUserBooks(user ?? undefined);
      } catch (error: any) {
        Logger.error("Error loading user books", { error });
      } finally {
        loadingUserBooks.current = false;
      }
    };
    if (state === AuthStateType.SIGNED_IN && user) {
      loadUserBooksAsync();
    }
  }, [state, user]);

  return <>{children}</>;
};

export default DataProvider;
