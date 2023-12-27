"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AuthStateType, selectAuth } from "../lib/features/auth/authSlice";
import useBook from "../hooks/useBook";

interface DataProviderProps {
  children?: React.ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { loadUserBooks } = useBook();
  const { user, state } = useSelector(selectAuth);

  useEffect(() => {
    const loadUserBooksAsync = async () => {
      try {
        await loadUserBooks(user ?? undefined);
      } catch (error) {
        console.error(error);
      }
    };
    if (state === AuthStateType.SIGNED_IN && user) {
      loadUserBooksAsync();
    }
  }, [state]);

  return <>{children}</>;
};

export default DataProvider;
