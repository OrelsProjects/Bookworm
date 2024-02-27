"use client";

import React from "react";
import BottomBar from "../../components/bottomBar/bottomBar";
import { useSelector } from "react-redux";
import { AuthStateType, selectAuth } from "../../lib/features/auth/authSlice";

const BottomBarProvider = () => {
  const { state } = useSelector(selectAuth);

  return state === AuthStateType.SIGNED_IN && <BottomBar />;
};

export default BottomBarProvider;
