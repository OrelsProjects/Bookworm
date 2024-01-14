"use client";

import { Button } from "./button";
import { useEffect, useState } from "react";
import Loading from "./loading";

export type TabItems = TabItem[];

export interface TabItem {
  label: string;
  href: string;
  selected?: boolean;
  loading?: boolean;
}

interface TabsProps {
  items: TabItem[];
  manualSelection?: boolean; // Should the selected be set by the parent
  onClick?: (href: string) => void; // Change the prop name to onClick
}

const Tabs = ({
  items,
  manualSelection: manualSelected,
  onClick,
}: TabsProps) => {
  console.log("items", items);
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    const selected = items.find((item) => item.selected);
    if (selected) {
      setSelectedValue(selected.href);
    }
  }, [items]);

  const handleClick = (href: string) => {
    if (!manualSelected) {
      setSelectedValue(items.find((item) => item.href === href)?.href ?? ""); // Find the index of the clicked item
    }
    if (onClick) {
      onClick(href);
    }
  };

  return (
    <div className="bg-primary-foreground p-2 rounded-full flex justify-center items-center gap-2">
      {items.map((item) => (
        <Button
          key={item.href}
          onClick={() => handleClick(item.href)}
          variant={`${selectedValue === item.href ? "selected" : "default"}`}
          className="rounded-full"
          size={"md"}
        >
          <div className="w-full h-full flex justify-center items-center relative">
            <div className={`${item.loading ? "invisible" : ""}`}>
              {item.label}
            </div>
            <Loading
              className={`${
                item.loading
                  ? "w-full h-full absolute top-0 left-0 right-0 bottom-0"
                  : "hidden"
              }`}
              innerClassName="!fill-primary"
            />
          </div>
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
