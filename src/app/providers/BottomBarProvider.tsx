"use client";

import React from "react";
import NavigationBar from "../../components/bottomBar/navigationBar";
import { useSelector } from "react-redux";
import { AuthStateType, selectAuth } from "../../lib/features/auth/authSlice";

const BottomBarProvider = ({ className }: { className?: string }) => {
  const { state } = useSelector(selectAuth);

  return (
    state === AuthStateType.SIGNED_IN && <NavigationBar className={className} />
  );
};

export default BottomBarProvider;
