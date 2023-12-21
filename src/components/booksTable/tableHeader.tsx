import React, { useEffect, useState } from "react";
import Image from "next/image";

export enum TableHeaderDirection {
  ASC = "asc",
  DESC = "desc",
  NONE = "none",
}

export interface TableHeaderItem {
  label: string;
  canSort?: boolean;
  direction?: TableHeaderDirection;
  groupId?: string; // Used to group columns together.
  onClick?: () => void;
}

export interface TableHeaderProps {
  items: TableHeaderItem[];
}
type GroupedItemsType = Record<string, TableHeaderItem[]>;

const TableHeader: React.FC<TableHeaderProps> = ({ items }) => {
  const [groupedItems, setGroupedItems] = useState<
    Record<string, TableHeaderItem[]>
  >({});

  useEffect(() => {
    const groups: GroupedItemsType = items.reduce((acc, item) => {
      const groupId = item.groupId || item.label;
      if (!acc[groupId]) {
        acc[groupId] = [];
      }
      acc[groupId].push(item);
      return acc;
    }, {} as GroupedItemsType);

    setGroupedItems(groups);
  }, [items]);

  const RenderSortComponent = (
    direction: TableHeaderDirection = TableHeaderDirection.NONE
  ) => {
    return (
      <div className="flex flex-col justify-center items-center gap-0.5">
        <Image
          src={
            direction === TableHeaderDirection.ASC
              ? "/arrowDownSelected.png"
              : "/arrowDown.png"
          }
          height={12}
          width={12}
          alt={"arrowUp"}
          className="text input fill-foreground rotate-180  cursor-pointer"
        />
        <Image
          src={
            direction === TableHeaderDirection.DESC
              ? "/arrowDownSelected.png"
              : "/arrowDown.png"
          }
          height={12}
          width={12}
          alt={"arrowDown"}
          className="text input cursor-pointer"
        />
      </div>
    );
  };

  const HeaderItem = (item: TableHeaderItem) => (
    <div key={item.label} className="flex flex-row gap-0.5">
      {item.label}
      {item.canSort && RenderSortComponent(item.direction)}
    </div>
  );

  const RenderGroup = (group: TableHeaderItem[]) => (
    <div className="flex flex-col justify-center items-center gap-0.5">
      {group.map(HeaderItem)}
    </div>
  );

  return (
    <div className="flex justify-around text-foreground uppercase tracking-wider bg-primary-foreground p-4">
      {Object.values(groupedItems).map((group, index) => (
        <div key={index}>{RenderGroup(group)}</div>
      ))}
    </div>
  );
};

export default TableHeader;
