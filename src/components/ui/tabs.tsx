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
  className?: string;
  selectable?: boolean;
  Title?: React.FC<any>;
  defaultSelected?: TabItem;
  onClick?: (item: TabItem) => void; // Change the prop name to onClick
}

const Tabs = ({
  items,
  Title,
  onClick,
  selectable,
  defaultSelected,
  className,
}: TabsProps) => {
  const [selectedItem, setSelectedItem] = useState<TabItem | null>(
    selectable ? defaultSelected || items[0] : null
  );

  const handleClick = (item: TabItem) => {
    setSelectedItem(item);
    if (onClick) {
      onClick(item);
    }
  };

  const Tab = ({ item }: { item: TabItem }) => {
    return (
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
    );
  };

  return (
    <div className={`flex flex-col gap-2.5 w-full md:w-fit`}>
      {Title && <Title />}
      <div
        className={`w-full md:w-fit rounded-full overflow-x-auto flex items-center gap-2 ${className}`}
      >
        {items.map((item) => (
          <Button
            key={`tab-${item.value}`}
            onClick={() => handleClick(item)}
            variant="outline"
            className={`rounded-full border-2 flex-shrink-0 !min-w-20 h-6 p-4 w-max ${
              selectedItem?.value === item?.value ? "!bg-primary" : ""
            } ${item.className}`}
            clickable={selectable}
          >
            <Tab item={item} />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
