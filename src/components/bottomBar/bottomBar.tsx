"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { BottomBarItem, bottomBarItems } from "./bottomBarItems";

const BottomBar = () => {
  const router = useRouter();
  const pathname = usePathname();
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
              className="flex items-center justify-center w-full h-full"
              onClick={() => {
                if (pathname.includes(item.path)) return;
                router.push(item.path);
                setSelected(item);
              }}
            >
              {selected?.path === item.path ? (
                <item.icon.Fill
                  className={item.className}
                  iconSize={item.size}
                />
              ) : (
                <item.icon.Outline
                  className={`${item.className} !text-background`}
                  iconSize={item.size}
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
