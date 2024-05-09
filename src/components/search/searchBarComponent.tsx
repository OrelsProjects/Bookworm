import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Search } from "../icons/search";
import { Clear } from "../icons/clear";

export interface SearchBarComponentProps {
  className?: string;
  autoFocus?: boolean;
  placeholder?: string;
  formClassName?: string;
  onFocus?: () => any;
  onBlur?: (value: string) => any;
  onSubmit?: (value: string) => any;
  onChange?: (value: string) => any;
}

export const SearchBarComponent: React.FC<SearchBarComponentProps> = ({
  onBlur,
  onFocus,
  onSubmit,
  onChange,
  autoFocus,
  className,
  placeholder,
  formClassName,
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
    <div className={`flex justify-between items-center ${className ?? ""}`}>
      <form
        onSubmit={(event: any) => {
          event.preventDefault();
          if (event.target) {
            onSubmit?.(event.target[0].value);
          }
        }}
        onFocus={onFocus}
        onBlur={() => onBlur?.(searchTerm)}
        className={`w-full ${formClassName}`}
      >
        <label
          htmlFor="search-bar"
          className="relative flex flex-row justify-center items-center w-full bg-background rounded-full border-2 border-foreground px-4"
        >
          <Search.Fill iconSize="sm" className="!text-foreground" />
          <Input
            type="text"
            id="search-bar"
            className="py-2 h-[46px] w-full rounded-full bg-background  text-foreground text-base placeholder:text-sm placeholder-gray-300 focus:outline-none border-none"
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
