"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../../lib/features/auth/authSlice";
import "../../eventTracker";
import dotenv from "dotenv";
dotenv.config();

interface APIProviderProps {
  children?: React.ReactNode;
}

const APIProvider: React.FC<APIProviderProps> = ({ children }) => {
  const { user } = useSelector(selectAuth);

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common["Authorization"] = user.token;
      axios.defaults.headers.common["user_id"] = user.userId;
    }
    axios.defaults.baseURL = window.location.origin;
  }, [user]);

  return <>{children}</>;
};

export default APIProvider;
