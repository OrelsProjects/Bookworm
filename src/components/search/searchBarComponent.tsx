import React, { useEffect, useState } from "react";
import { Input } from "../input";
import Image from "next/image";

interface SearchBarComponentProps {
  onSubmit: (value: string) => any;
  onChange: (value: string) => any;
  className?: string;
}

export const SearchBarComponent: React.FC<SearchBarComponentProps> = ({
  onSubmit,
  onChange,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [previousSearchTerm, setPreviousSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm !== previousSearchTerm) {
      setPreviousSearchTerm(searchTerm);
      onChange(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div
      className={`w-full flex justify-between items-center bg-secondary ${className}`}
    >
      <form
        onSubmit={(event: any) => {
          event.preventDefault();
          if (event.target) {
            onSubmit(event.target[0].value);
          }
        }}
        className={`w-full`}
      >
        <label
          htmlFor="search-bar"
          className="relative flex flex-row w-full bg-background rounded-full border-2 px-4 py-1"
        >
          <Image
            src="search.svg"
            alt="Search"
            height={32}
            width={32}
            className="cursor-pointer"
            onClick={() => onSubmit(searchTerm)}
          />
          <Input
            type="text"
            id="search-bar"
            className="py-2 w-full h-full rounded-full bg-background  text-white placeholder-gray-300 focus:outline-none border-none"
            placeholder="Search all books, authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Image
            src="x.svg"
            alt="clear"
            height={32}
            width={32}
            className={`cursor-pointer ${
              searchTerm ? "" : "invisible placeholder-gray-300"
            }`}
            onClick={() => setSearchTerm("")}
          />
        </label>
      </form>
    </div>
  );
};
