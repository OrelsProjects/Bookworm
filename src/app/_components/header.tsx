"use client";
import { Button } from "@/src/components/ui/button";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/src/lib/features/auth/authSlice";
import useAuth from "@/src/hooks/useAuth";
import Avatar from "./avatar";
import { Logger } from "@/src/logger";
import Sidebar from "./sidebar";
import GoogleLogin from "../../components/googleLogin";

export interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps): React.ReactNode => {
  const { user, loadingState, error } = useSelector(selectAuth);

  useEffect(() => {
    if (error) {
      Logger.error("Error in header", { data: { error } });
    }
  }, [error]);

  return (
    !loadingState.loading && (
      <div className="fixed top-8 w-fit z-10 right-0">
        <div
          className={`flex justify-end items-center w-fit z-10 relative ${
            className ?? ""
          }`}
        >
          {user ? (
            <div>
              <Avatar
                avatarUrl={user?.profilePictureUrl}
                defaultText={user?.displayName ?? user.email}
              />
              
            </div>
          ) : (
            <div className="pt-1.5">
              <GoogleLogin text="Login" />
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default Header;
