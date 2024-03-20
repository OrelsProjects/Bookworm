import React, { useEffect, useState } from "react";
import { Input } from "../input";
import { Search } from "../icons/search";
import { Clear } from "../icons/clear";

export interface SearchBarComponentProps {
  onSubmit?: (value: string) => any;
  onChange?: (value: string) => any;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onFocus?: () => any;
  onBlur?: (value: string) => any;
}

export const SearchBarComponent: React.FC<SearchBarComponentProps> = ({
  onSubmit,
  onChange,
  className,
  placeholder,
  onFocus,
  onBlur,
  autoFocus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [previousSearchTerm, setPreviousSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm !== previousSearchTerm) {
      setPreviousSearchTerm(searchTerm);
      onChange?.(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div
      className={`w-full flex justify-between items-center ${className ?? ""}`}
    >
      <form
        onSubmit={(event: any) => {
          event.preventDefault();
          if (event.target) {
            onSubmit?.(event.target[0].value);
          }
        }}
        onFocus={onFocus}
        onBlur={() => onBlur?.(searchTerm)}
        className={`w-full`}
      >
        <label
          htmlFor="search-bar"
          className="relative flex flex-row justify-center items-center w-full bg-background rounded-full border-2 px-4"
        >
          <Search.Fill iconSize="sm" className="!text-foreground" />
          <Input
            type="text"
            id="search-bar"
            className="py-2 w-full h-full rounded-full bg-background  text-foreground text-base placeholder:text-sm placeholder-gray-300 focus:outline-none border-none"
            placeholder={placeholder ?? "Search..."}
            value={searchTerm}
            autoFocus={autoFocus}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Clear.Fill
              iconSize="xs"
              className="!text-foreground"
              onClick={() => setSearchTerm("")}
            />
          )}
        </label>
      </form>
    </div>
  );
};
