"use client";
import { Button, Tabs } from "@/src/components";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { selectAuth } from "@/src/lib/features/auth/authSlice";
import useAuth from "@/src/hooks/useAuth";
import { ModalTypes, showModal } from "@/src/lib/features/modal/modalSlice";
import Avatar from "./avatar";
import { EventTracker } from "@/src/eventTracker";
import { TabItems } from "@/src/components/tabs";
import { Logger } from "@/src/logger";
import Feedback from "@/src/components/feedback";
import Sidebar from "./sidebar";

export interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps): React.ReactNode => {
  const { user, loadingState, error } = useSelector(selectAuth);
  const { signInWithGoogle } = useAuth();
  // const [tabs, setTabs] = React.useState<TabItems>([
  //   {
  //     label: "Home",
  //     href: "/home",
  //     selected: true,
  //   },
  //   {
  //     label: "My Library",
  //     href: "/my-library",
  //   },
  //   // {
  //   //   label: "Statistics",
  //   //   href: "/statistics",
  //   // },
  // ]);

  if (!user) {
    return;
  }

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong.. we're on it!");
      Logger.error("Error in header", { data: { error } });
    }
  }, [error]);
  console.log(user);
  return (
    !loadingState.loading && (
      <div
        className={`flex justify-between items-center w-full z-30 relative ${
          className ?? ""
        }`}
      >
        <Sidebar />
        {user ? (
          <Avatar avatarUrl={user?.profilePictureUrl} />
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
    )
  );
};

export default Header;
