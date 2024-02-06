import React from "react";
import Image from "next/image";

export enum TableHeaderDirection {
  ASC = "asc",
  DESC = "desc",
  NONE = "none",
}

export enum TableHeaders {
  TITLE = "title",
  AUTHORS = "authors",
  PAGES = "pages",
  GENRE = "genre",
  PUBLISH_YEAR = "publish_year",
  RATING = "rating",
}

export interface TableHeaderProps {
  onSort?: (header: TableHeaders, direction: TableHeaderDirection) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ onSort }) => {
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
          alt="arrowUp"
          className="text input fill-foreground rotate-180 cursor-pointer"
        />
        <Image
          src={
            direction === TableHeaderDirection.DESC
              ? "/arrowDownSelected.png"
              : "/arrowDown.png"
          }
          height={12}
          width={12}
          alt="arrowDown"
          className="text input cursor-pointer"
        />
      </div>
    );
  };

  const HeaderItem = ({
    label,
    canSort,
    direction,
  }: {
    label: string;
    canSort?: boolean;
    direction?: TableHeaderDirection;
  }) => (
    <div className="flex justify-center items-center flex-row gap-0.5">
      {label}
      {canSort && RenderSortComponent(direction)}
    </div>
  );

  // Use the grid-header-table class to align items in a grid
  return (
    <div className="grid-header-table text-foreground rounded-lg tracking-wider bg-primary-foreground p-2 mb-2">
      {/* Empty cell for the image */}
      <div></div>
      <HeaderItem label="Title" direction={TableHeaderDirection.NONE} />

      <HeaderItem label="Author" direction={TableHeaderDirection.NONE} />
      <div className="w-full flex flex-row justify-center items-center gap-4">
        <HeaderItem label="Pages" direction={TableHeaderDirection.NONE} />
        <HeaderItem label="Genre" direction={TableHeaderDirection.NONE} />
        <HeaderItem label="Publish" direction={TableHeaderDirection.NONE} />
      </div>
      <HeaderItem label="Rating" direction={TableHeaderDirection.NONE} />
    </div>
  );
};

export default TableHeader;
