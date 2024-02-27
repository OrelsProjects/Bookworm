"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { BottomBarItem, bottomBarItems } from "./bottomBarItems";

const BottomBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = React.useState<string>("");

  useEffect(() => {
    if (bottomBarItems.map((item) => item.path).includes(pathname)) {
      setSelected(pathname);
    } else {
      setSelected(bottomBarItems[0].path);
    }
  }, [pathname]);

  const isItemSelected = (item: BottomBarItem) => selected === item.path;

  return (
    <div className="flex items-center justify-between gap-4 w-max bg-foreground rounded-3xl absolute bottom-8 py-3 px-7">
      {bottomBarItems.map((item) => {
        return (
          <div
            key={item.name}
            className="flex items-center justify-center w-full h-full"
            onClick={() => {
              if (item.path === pathname) return;
              router.push(item.path);
              setSelected(item.name);
            }}
          >
            {isItemSelected(item) ? (
              <item.icon.Fill className="w-8 h-8" />
            ) : (
              <item.icon.Outline className="w-8 h-8 text-background" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BottomBar;
