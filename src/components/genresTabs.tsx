import React from "react";
import Tabs, { TabItem } from "./ui/tabs";
import { unslugifyText } from "../utils/textUtils";
import { cn } from "../../lib/utils";
interface GenresTabsProps {
  take: number;
  genres: string[];
  className?: string;
  selectable?: boolean;
  itemClassName?: string;
  onSelected?: (genre: string) => void;
}

const GenresTabs: React.FC<GenresTabsProps> = ({
  genres,
  selectable,
  onSelected,
  className,
  itemClassName,
  take = 3,
}) => {
  return (
    <Tabs
      items={genres.slice(0, take).map((genre: string) => ({
        label: unslugifyText(genre),
        value: genre,
        className: cn(
          "h-5 py-3 md:h-10 border-2 font-bold leading-6 md:text-base ",
          itemClassName
        ),
      }))}
      selectable={selectable}
      onClick={(item: TabItem) => {
        if (selectable) {
          onSelected?.(item.value);
        }
      }}
      className={`flex flex-row justify-between md:justify-start ${className}`}
    />
  );
};

export default GenresTabs;
