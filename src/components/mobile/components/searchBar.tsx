"use client";

import React, { useEffect } from "react";
import useSearch, { UseSearchResult } from "../../../hooks/useSearch";
import BookComponent, { SearchItemSkeleton } from "../../search/bookComponent";
import toast from "react-hot-toast";
// import { SearchBarComponent } from "./searchBarComponent";

const TOP_RESULTS_COUNT = 3;

export interface CustomSearchBarProps {
  item: React.ReactNode;
  onSearch: (text: string) => void;
}

export interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className }: SearchBarProps) => {
  const { loading, error, updateSearchValue, books }: UseSearchResult =
    useSearch();

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch books");
    }
  }, [error]);

  const onSubmit = (value: string) => updateSearchValue(value);
  const onChange = (value: string) => updateSearchValue(value);

  const classItems = "px-6 py-4 rounded-t-3xl rounded-b-lg";
  const classNoItems = "rounded-full";

  return (
    <div className={`w-full h-full flex flex-col gap-4 ${className}`}>
      {/* <SearchBarComponent
        onSubmit={onSubmit}
        onChange={onChange}
        className={`transition-all duration-300 ease-in-out ${
          books && books.length > 0 ? classItems : classNoItems
        }`}
      /> */}
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
              <div>Top {TOP_RESULTS_COUNT} Results</div>
              <div className="flex gap-2 flex-col overflow-scroll">
                {books.map(
                  (book, i) =>
                    i < TOP_RESULTS_COUNT && (
                      <BookComponent
                        key={
                          book.title +
                          book.isbn10 +
                          book.datePublished +
                          book.isbn
                        }
                        book={book}
                        isFirstInList={i === 0}
                      />
                    )
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default SearchBar;
