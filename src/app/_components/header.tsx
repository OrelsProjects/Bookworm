"use client";
import { Button, Tabs } from "@/src/components";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { selectAuth } from "@/src/lib/features/auth/authSlice";
import useAuth from "@/src/hooks/useAuth";
import { ModalTypes, showModal } from "@/src/lib/features/modal/modalSlice";
import Avatar from "./avatar";
import { EventTracker } from "@/src/eventTracker";
import { TabItems } from "@/src/components/tabs";

export interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps): React.ReactNode => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, error } = useSelector(selectAuth);
  const { signInWithGoogle } = useAuth();
  const [tabs, setTabs] = React.useState<TabItems>([
    {
      label: "Home",
      href: "/home",
      selected: true,
    },
    {
      label: "My Library",
      href: "/my-library",
    },
    // {
    //   label: "Statistics",
    //   href: "/statistics",
    // },
  ]);

  useEffect(() => {
    EventTracker.track(
      `User navigated to ${pathname?.toString()?.replace("/", "")}`
    );
    const newTabs = [...tabs];
    newTabs.map((tab) => {
      tab.loading = false;
      if (tab.href === pathname) {
        tab.selected = true;
      } else {
        tab.selected = false;
      }
    });
    setTabs(newTabs);
  }, [pathname]);

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong.. we're on it!");
    }
  }, [error]);

  const navigateTo = (href: string) => {
    if (href === pathname) {
      return;
    }
    router.push(href);
    const newTabs = [...tabs];
    newTabs.map((tab) => {
      if (tab.href === href) {
        tab.loading = true;
      } else {
        tab.loading = false;
      }
    });
    setTabs(newTabs);
  };

  const NavTabs = (): React.ReactNode => {
    return (
      <Tabs
        items={tabs}
        manualSelection
        onClick={(href) => navigateTo(href)}
      ></Tabs>
    );
  };

  return (
    !loading && (
      <div
        className={`flex justify-between items-start w-full h-12 z-30 relative ${className}`}
      >
        <div
          className="bg-primary-foreground h-12 w-48 rounded-full flex justify-center items-center cursor-pointer"
          onClick={() => router.push("/home")}
        >
          <Image
            src="/BookWormText.png"
            height={24}
            width={140}
            alt={""}
            className="text input  pointer-events-none"
          />
        </div>
        <NavTabs />
        <div className="flex flex-row items-center gap-4">
          <Button
            size={"md"}
            variant="selected"
            className="w-32"
            onClick={() => {
              dispatch(showModal({ type: ModalTypes.IMPORT_BOOKS }));
            }}
          >
            Import Books +
          </Button>
          {user ? (
            <Avatar />
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
