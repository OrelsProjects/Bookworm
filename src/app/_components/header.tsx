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
      <div className="relative h-0 w-full flex items-start justify-end mt-1 z-50">
        <div
          className={`flex justify-end items-center w-fit z-10 relative ${
            className ?? ""
          }`}
        >
          {user ? (
            <div className="h-[50px] w-[50px]">
              <Avatar
                avatarUrl={user?.profilePictureUrl}
                defaultText={user?.displayName ?? user.email}
              />
            </div>
          ) : (
            <GoogleLogin />
          )}
        </div>
      </div>
    )
  );
};

export default Header;
