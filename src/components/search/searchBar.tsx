"use client";

import React, { useEffect } from "react";
import useSearch, { UseSearchResult } from "../../hooks/useSearch";
import BookSearchResult, { SearchItemSkeleton } from "./BookSearchResult";
import toast from "react-hot-toast";
import { SearchBarComponent } from "./searchBarComponent";

const TOP_RESULTS_COUNT = 10;

export interface SearchBarProps {
  CustomSearchItem?: typeof BookSearchResult;
  CustomSearchItemSkeleton?: React.FC;
  className?: string;
  onSearch?: (text: string) => void;
  onFocus?: () => any;
  onEmpty?: () => any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  CustomSearchItemSkeleton,
  CustomSearchItem,
  className,
  onSearch,
  onFocus,
  onEmpty,
}: SearchBarProps) => {
  const {
    loading,
    error,
    updateSearchValue,
    books,
    searchValue,
  }: UseSearchResult = useSearch();

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch books");
    }
  }, [error]);

  const onSubmit = (value: string) =>
    onSearch ? onSearch(value) : updateSearchValue(value);
  const onChange = (value: string) => {
    if (!value) {
      onEmpty?.();
    } else {
      onFocus?.();
    }
    updateSearchValue(value);
  };

  // const classItems = "px-6 py-4 rounded-t-3xl rounded-b-lg";
  const classNoItems = "rounded-full";

  return (
    <div
      className={`w-full flex flex-col gap-4 overflow-auto scrollbar-hide ${
        className ?? ""
      }`}
    >
      <SearchBarComponent
        onSubmit={onSubmit}
        onChange={onChange}
        className={`transition-all duration-300 ease-in-out ${
          books && books.length > 0 ? classNoItems : classNoItems
        }`}
        placeholder="Search all books, authors..."
      />
      <div className="flex flex-col gap-3 overflow-auto scrollbar-hide">
        {loading ? (
          CustomSearchItemSkeleton ? (
            <CustomSearchItemSkeleton />
          ) : (
            <>
              {Array.from(Array(TOP_RESULTS_COUNT)).map((_, index) => (
                <SearchItemSkeleton key={`search-item-skeleton-${index}`} />
              ))}
            </>
          )
        ) : (
          books &&
          books.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="font-bold text-2xl">Books</div>
              <div className="flex gap-6 flex-col overflow-auto scrollbar-hide">
                {books
                  .slice(0, TOP_RESULTS_COUNT)
                  .map((book, i) =>
                    CustomSearchItem ? (
                      <CustomSearchItem
                        key={
                          book.title +
                          book.isbn10 +
                          book.datePublished +
                          book.isbn
                        }
                        book={book}
                      />
                    ) : (
                      <BookSearchResult
                        key={
                          book.title +
                          book.isbn10 +
                          book.datePublished +
                          book.isbn
                        }
                        book={book}
                      />
                    )
                  )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchBar;
