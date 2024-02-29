import React, { useEffect, useState } from "react";
import { Input } from "../input";

interface SearchBarComponentProps {
  onSubmit: (value: string) => any;
  onChange: (value: string) => any;
  placeholder?: string;
  className?: string;
}

export const SearchBarComponent: React.FC<SearchBarComponentProps> = ({
  onSubmit,
  onChange,
  className,
  placeholder,
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
    <div className={`w-full flex justify-between items-center ${className}`}>
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
          <img
            src="search.svg"
            alt="Search"
            height={20}
            width={20}
            className="cursor-pointer"
            onClick={() => onSubmit(searchTerm)}
          />
          <Input
            type="text"
            id="search-bar"
            className="py-2 w-full h-full rounded-full bg-background  text-foreground text-base placeholder:text-sm placeholder-gray-300 focus:outline-none border-none"
            placeholder={placeholder ?? "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            src="x.svg"
            alt="clear"
            height={20}
            width={20}
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
