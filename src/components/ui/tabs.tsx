"use client";

import { Button } from "./button";
import { useState } from "react";
import Loading from "./loading";

export type TabItems = TabItem[];

export interface TabItem {
  label: string;
  value: string;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

interface TabsProps {
  items: TabItem[];
  Title?: React.FC<any>;
  onClick?: (item: TabItem) => void; // Change the prop name to onClick
}

const Tabs = ({ items, Title, onClick }: TabsProps) => {
  const [selectedItem, setSelectedItem] = useState<TabItem | null>(
    items[0] ?? null
  );

  const handleClick = (item: TabItem) => {
    setSelectedItem(item);
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div className="flex flex-col gap-[5px] w-full">
      {Title && <Title />}
      <div className="rounded-full overflow-x-auto w-full flex items-center gap-2">
        {items.map((item) => (
          <Button
            key={`tab-${item.value}`}
            onClick={() => handleClick(item)}
            variant="outline"
            className={`rounded-full flex-shrink-0 !min-w-20 h-6 p-4 w-max ${
              selectedItem?.value === item?.value
                ? "bg-primary border-primary"
                : ""
            } ${item.className}`}
          >
            <div className="w-full h-full flex justify-center items-center relative">
              <div
                className={`flex flex-row gap-2 items-center ${
                  item.loading ? "invisible" : ""
                }`}
              >
                {item.icon}
                {item.label}
              </div>
              <Loading
                className={`${
                  item.loading
                    ? "w-full h-full absolute top-0 left-0 right-0 bottom-0"
                    : "hidden"
                }`}
                spinnerClassName="!fill-primary"
              />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
