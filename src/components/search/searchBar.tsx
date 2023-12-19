"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "../input";
import useSearch, { UseSearchResult } from "../../hooks/useSearch";
import SearchItem, { SearchItemSkeleton } from "./searchItem";
import { Book } from "../../models";

export interface SearchBarProps {
  className?: string;
  onChange?: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  onChange,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    loading,
    updateSearchValue,
    books,
    addBookToLibrary,
  }: UseSearchResult = useSearch();

  const handleSearch = async (event: any) => {
    event.preventDefault();
    if (event.target) {
      updateSearchValue(event.target.value);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (event.target) {
      updateSearchValue(event.target[0].value);
    }
  };

  const addToLibrary = async (book: Book) => {
    try {
      const bookList = [book];
      const response = await addBookToLibrary(bookList[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const classItems = "px-6 py-4 rounded-t-3xl rounded-b-lg";
  const classNoItems = "rounded-full";

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div
        className={`w-full flex justify-between items-center bg-secondary 
        ${books && books.length > 0 ? classItems : classNoItems}
        ${className}`}
      >
        <form
          onChange={handleSearch}
          onSubmit={handleSubmit}
          className={`w-full`}
        >
          <label
            htmlFor="search-bar"
            className="relative flex flex-row w-full bg-secondary rounded-full px-6 py-4"
          >
            <Image src="search.svg" alt="Search" height={32} width={32} />
            <Input
              type="text"
              id="search-bar"
              className="py-2 w-full h-full rounded-full bg-secondary text-white placeholder-gray-300 focus:outline-none border-none"
              placeholder="Search for the book"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </form>
      </div>
      <div className="flex flex-col gap-1 overflow-auto">
        {loading ? (
          <>
            <SearchItemSkeleton />
            <SearchItemSkeleton />
            <SearchItemSkeleton />
          </>
        ) : (
          books &&
          books.length > 0 && (
            <>
              <div>Top 3 Results</div>
              {books.map(
                (book, i) =>
                  i < 3 && (
                    <SearchItem
                      key={
                        book.title +
                        book.isbn10 +
                        book.datePublished +
                        book.isbn
                      } // isbn/isbn10 might be null
                      book={book}
                      onAddToLibrary={(book) => {
                        addToLibrary(book);
                      }}
                    />
                  )
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default SearchBar;
