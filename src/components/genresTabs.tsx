import React from "react";
import Tabs, { TabItem } from "./ui/tabs";
import { unslugifyText } from "../utils/textUtils";
interface GenresTabsProps {
  genres: string[];
  take: number;
  selectable?: boolean;
  onSelected?: (genre: string) => void;
  className?: string;
}

const GenresTabs: React.FC<GenresTabsProps> = ({
  genres,
  selectable,
  onSelected,
  take = 3,
  className,
}) => {
  return (
    <Tabs
      items={genres.slice(0, take).map((genre: string) => ({
        label: unslugifyText(genre),
        value: genre,
        className: "!h-5 !py-3 !border-2 font-bold leading-6",
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
