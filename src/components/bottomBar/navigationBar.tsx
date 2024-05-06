"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { NavigationBarItem, navigationBarItems } from "./navigationBarItems";
import { getIconSize } from "../../consts/icon";
import { useModal } from "../../hooks/useModal";
import { Button } from "../ui/button";

const NavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { clearStack } = useModal();
  const [selected, setSelected] = React.useState<NavigationBarItem | null>();

  useEffect(() => {
    const selected = navigationBarItems.find((item) =>
      pathname.includes(item.path)
    );
    setSelected(selected);
  }, [pathname]);

  return (
    <div className="w-full h-fit flex flex-row justify-center items-center z-20 fixed bottom-0">
      <div className="w-full h-15 flex items-center justify-center gap-[70px] rounded-xl fixed bottom-0 bg-background">
        {navigationBarItems.map((item) => {
          return (
            <Button
              data-ripple-light={false}
              data-ripple-dark={false}
              key={item.name}
              className="flex items-center justify-center rounded-full w-fit h-fit cursor-pointer bg-transparent p-0"
              onClick={() => {
                if (pathname.includes(item.path)) return;
                router.push(item.path);
                clearStack();
                setSelected(item);
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

export default NavigationBar;
