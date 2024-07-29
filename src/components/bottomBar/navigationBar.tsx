"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { NavigationBarItem, navigationBarItems } from "./navigationBarItems";
import { getIconSize } from "../../consts/icon";
import { useModal } from "../../hooks/useModal";
import { Button } from "../ui/button";
import Avatar from "../../app/_components/avatar";
import { useAppSelector } from "../../lib/hooks";
import { cn } from "../../lib/utils";
import { selectAuth } from "../../lib/features/auth/authSlice";
import Image from "next/image";

const BottomNavigationBar = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { clearStack } = useModal();
  const [selected, setSelected] = React.useState<NavigationBarItem | null>();

  return (
    <div
      className={cn(
        "w-full h-fit flex flex-row justify-center items-center z-20 fixed bottom-0 md:hidden",
        className
      )}
    >
      <div className="w-full h-15 flex items-center justify-center gap-[70px] fixed bottom-0 bg-background">
        {navigationBarItems.map((item) => {
          return (
            <Button
              data-ripple-light={false}
              data-ripple-dark={false}
              key={item.name}
              className="flex items-center justify-center rounded-full w-fit h-fit cursor-pointer bg-transparent p-0"
              onClick={() => {
                if (window.location.origin.includes(item.path)) {
                  router.refresh();
                } else {
                  router.push(item.path);
                  clearStack();
                  setSelected(item);
                }
              }}
            >
              {selected?.path === item.path ? (
                <item.iconSelected
                  className={`${item.className} ${
                    getIconSize({
                      size: item.size,
                    }).className
                  } !text-primary`}
                />
              ) : (
                <item.icon
                  className={`${item.className} ${
                    getIconSize({
                      size: item.size,
                    }).className
                  } !text-foreground`}
                />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

const SideNavigationBar = ({ className }: { className?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { clearStack } = useModal();
  const { user } = useAppSelector(selectAuth);

  const [selected, setSelected] = React.useState<NavigationBarItem | null>();
  const [previousPath, setPreviousPath] = React.useState<string>(pathname);

  useEffect(() => {
    const selected = navigationBarItems.find((item) =>
      pathname.includes(item.path)
    );
    setSelected(selected);
  }, [pathname]);

  // This is for the usecase when I use window.history.pushState to change the url
  useEffect(() => {
    const pushState = history.pushState;
    history.pushState = function (state, title, url) {
      pushState.call(history, state, title, url);
      const selected = navigationBarItems.find((item) => {
        return item.path && window.location.pathname.includes(item.path);
      });
      setSelected(selected);
    };
    return () => {
      history.pushState = pushState;
    };
  }, []);

  // onpopstate - set the right nav item
  useEffect(() => {
    const onPopState = () => {
      const selected = navigationBarItems.find((item) => {
        console.log(item.path, window.location.pathname);
        return item.path && window.location.pathname.includes(item.path);
      });
      setSelected(selected);
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return (
    <div
      className={cn(
        "content-size h-16 hidden md:flex flex-row justify-between items-center z-40 sticky top-0 mx-auto bg-background",
        className
      )}
    >
      <div
        className="w-fit h-fit flex flex-row justify-center items-center gap-1 hover:!text-muted"
        onClick={() => {
          router.push("/explore");
          clearStack();
        }}
      >
        <Image
          src="/favicon.png"
          alt="logo"
          width={30}
          height={30}
          className="cursor-pointer"
        />
        <div className="flex justify-start items-start">
          <span className="text-3xl font-thin cursor-pointer pt-2">BookWiz</span>
        </div>
      </div>
      <div className="w-fit h-full flex flex-row gap-12">
        {navigationBarItems.map((item) => {
          return (
            <div
              className={cn(
                "w-fit h-full flex flex-row justify-center items-center relative cursor-pointer before:h-1.5 before:w-full before:absolute before:bottom-0  before:rounded-full before:transition-all",
                {
                  "before:bg-primary": selected?.path === item.path,
                  "before:hover:bg-muted": selected?.path !== item.path,
                }
              )}
              key={`navbar-item-${item.name}-${item.path}`}
            >
              <Button
                data-ripple-light={false}
                data-ripple-dark={false}
                key={item.name}
                className="flex items-center justify-start rounded-full w-fit h-fit cursor-pointer bg-transparent p-0 gap-1"
                onClick={() => {
                  clearStack();
                  {
                    router.push(item.path);
                    setSelected(item);
                    if (item.path === previousPath) {
                      clearStack();
                    }
                    setPreviousPath(item.path);
                  }
                }}
              >
                <item.icon
                  className={cn("h-[22px] w-[22px] text-foreground")}
                />
                <span className={cn("text-base leading-5 text-foreground")}>
                  {item.name}
                </span>
              </Button>
            </div>
          );
        })}
      </div>
      <Avatar
        avatarUrl={user?.profilePictureUrl}
        defaultText={user?.displayName || user?.email}
        imageClassName="!w-10 !h-10 flex-shrink-0"
      />
    </div>
  );
};

const NavigationBar = ({ className }: { className?: string }) => {
  return (
    <>
      <BottomNavigationBar className={className} />
      <SideNavigationBar className={className} />
    </>
  );
};

export default NavigationBar;
