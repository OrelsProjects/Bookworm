import React, { useState } from "react";
import Image from "next/image";
import { Input } from "./input";

export interface SearchBarProps {
  className?: string;
  onChange?: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  onChange,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (onChange) {
      onChange(searchTerm);
    }
  };

  return (
    <div
      className={`w-full flex justify-between items-center rounded-full bg-secondary px-6 ${className}`}
    >
      <form onSubmit={handleSearch} className={`w-full py-4`}>
        <label htmlFor="search-bar" className="relative flex flex-row w-full bg-secondary rounded-full px-6 py-4">
          <Image src="search.svg" alt="Search" height={32} width={32} />
          <Input
            type="text"
            id="search-bar"
            className="py-2 w-full rounded-full bg-secondary text-white placeholder-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Search for the book"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </form>
    </div>
  );
};

export default SearchBar;
