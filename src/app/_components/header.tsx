"use client";
import { Button } from "@/src/components/button";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/src/lib/features/auth/authSlice";
import useAuth from "@/src/hooks/useAuth";
import Avatar from "./avatar";
import { Logger } from "@/src/logger";
import Sidebar from "./sidebar";

export interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps): React.ReactNode => {
  const { user, loadingState, error } = useSelector(selectAuth);
  const { signInWithGoogle } = useAuth();

  if (!user) {
    return;
  }

  useEffect(() => {
    if (error) {
      Logger.error("Error in header", { data: { error } });
    }
  }, [error]);

  return (
    !loadingState.loading && (
      <div className="fixed top-0 w-fit z-10 right-0">
        <div
          className={`flex justify-end items-center w-fit z-10 relative ${
            className ?? ""
          }`}
        >
          {user ? (
            <Avatar
              avatarUrl={user?.profilePictureUrl}
              defaultText={user?.displayName ?? user.email}
            />
          ) : (
            <Button
              size={"md"}
              variant="selected"
              className="w-32"
              onClick={() => signInWithGoogle()}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    )
  );
};

export default Header;
