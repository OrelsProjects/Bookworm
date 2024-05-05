"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { NavigationBarItem, navigationBarItems } from "./navigationBarItems";
import { getIconSize } from "../../consts/icon";
import { useModal } from "../../hooks/useModal";

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
    <div className="w-full h-fit flex flex-row justify-center z-40 fixed bottom-0 inset-0">
      <div className="w-full h-15 flex items-center justify-between gap-4 bg-background rounded-xl fixed bottom-0 py-3 px-7">
        {navigationBarItems.map((item) => {
          return (
            <div
              key={item.name}
              className="flex items-center justify-center w-full h-full cursor-pointer"
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationBar;
