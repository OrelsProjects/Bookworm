"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../lib/features/auth/authSlice";
import dotenv from "dotenv";
dotenv.config();

interface ApiProviderProps {
  children?: React.ReactNode;
}

const APIProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const { user } = useSelector(selectAuth);

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common["Authorization"] = user.token;
      axios.defaults.headers.common["user_id"] = user.id;
      // Set base url
      // axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      axios.defaults.baseURL = "http://localhost:3000/dev/api";
    }
  }, [user]);

  return <>{children}</>;
};

export default APIProvider;
