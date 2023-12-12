import React, { useState } from "react";
import Image from "next/image";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement your search logic here
    console.log("Searching for:", searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <label htmlFor="search-bar" className="relative block">
        <span className="sr-only">Search for a book</span>
        <input
          type="text"
          id="search-bar"
          className="pl-10 pr-4 py-2 block w-full rounded-lg bg-blue-800 text-white placeholder-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Search for the book"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Image
            src="search.svg"
            alt="Search"
            className="h-5 w-5 text-gray-400"
          />
        </div>
      </label>
      <button type="submit" className="hidden">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
