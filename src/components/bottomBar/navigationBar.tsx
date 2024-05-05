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
  const [selected, setSelected] = React.useState<NavigationBarItem>();

  useEffect(() => {
    const selected = navigationBarItems.find((item) =>
      pathname.includes(item.path)
    );
    setSelected(selected ?? navigationBarItems[0]);
  }, [pathname]);

  return (
    <div className="w-full h-fit flex flex-row justify-center items-center z-40 fixed bottom-0 inset-0">
      <div className="w-full h-15 flex items-center justify-around gap-4 bg-background rounded-xl fixed bottom-0 py-3 px-7">
        {navigationBarItems.map((item) => {
          return (
            <Button
              data-ripple-light={false}
              data-ripple-dark={false}
              key={item.name}
              className="flex items-center justify-center rounded-full w-fit h-fit cursor-pointer bg-transparent"
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
