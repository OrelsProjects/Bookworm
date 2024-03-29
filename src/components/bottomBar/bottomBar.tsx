"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { BottomBarItem, bottomBarItems } from "./bottomBarItems";
import { getIconSize } from "../../consts/icon";
import { useModal } from "../../hooks/useModal";

const BottomBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { clearStack } = useModal();
  const [selected, setSelected] = React.useState<BottomBarItem>();

  useEffect(() => {
    const selected = bottomBarItems.find((item) =>
      pathname.includes(item.path)
    );
    setSelected(selected ?? bottomBarItems[0]);
  }, [pathname]);

  return (
    <div className="w-full h-fit flex flex-row justify-center z-50 absolute">
      <div className="flex items-center justify-between gap-4 w-max bg-foreground rounded-xl fixed bottom-8 py-3 px-7">
        {bottomBarItems.map((item) => {
          return (
            <div
              key={item.name}
              className="flex items-center justify-center w-full h-full cursor-pointer"
              onClick={() => {
                if (pathname.includes(item.path)) return;
                router.push(item.path);
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
                  } !text-background`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BottomBar;
