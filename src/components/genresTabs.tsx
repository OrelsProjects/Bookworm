import React from "react";
import Tabs from "./ui/tabs";
import { unslugifyText } from "../utils/textUtils";
interface GenresTabsProps {
  genres: string[];
  take: number;
}

const GenresTabs: React.FC<GenresTabsProps> = ({ genres, take = 3 }) => {
  return (
    <Tabs
      items={genres.slice(0, take).map((genre: string) => ({
        label: unslugifyText(genre),
        value: unslugifyText(genre),
        className: "!h-5 !py-3 !border-2 font-bold leading-6",
      }))}
      selectable={false}
      className="flex flex-row !justify-between mb-3"
    />
  );
};

export default GenresTabs;
