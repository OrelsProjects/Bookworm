"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/src/lib/features/auth/authSlice";
import Avatar from "./avatar";
import { Logger } from "@/src/logger";
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
      <div className="relative h-0 w-full flex items-start justify-end">
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
