"use client";

import React, { useEffect } from "react";
import useSearch, { UseSearchResult } from "../../hooks/useSearch";
import BookSearchResult, { SearchItemSkeleton } from "./BookSearchResult";
import toast from "react-hot-toast";
import { SearchBarComponent } from "./searchBarComponent";

const TOP_RESULTS_COUNT = 10;

type SearchBarProps = {
  CustomSearchItem?: typeof BookSearchResult;
  CustomSearchItemSkeleton?: React.FC;
  className?: string;
  autoFocus?: boolean;
  onChange?: (text: string, previous?: string) => void;
  onSearch?: (text: string) => void;
  onFocus?: () => any;
  onEmpty?: () => any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  CustomSearchItemSkeleton,
  CustomSearchItem,
  className,
  onChange,
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

  useEffect(() => {
    if (loading) {
      onSearch?.(searchValue);
    }
  }, [loading]);

  const onSubmit = (value: string) => updateSearchValue(value);

  const handleOnChange = (value: string) => {
    if (!value) {
      onEmpty?.();
    } else {
      onFocus?.();
    }
    onChange?.(value, searchValue);
    updateSearchValue(value);
  };

  return (
    <div
      className={`w-full flex flex-col gap-4 overflow-auto scrollbar-hide ${
        className ?? ""
      }`}
    >
      <SearchBarComponent
        onSubmit={onSubmit}
        onChange={handleOnChange}
        className="transition-all duration-300 ease-in-out rounded-full"
        placeholder="Search all books, authors..."
        autoFocus
      />
      <div className="flex flex-col gap-3 overflow-auto scrollbar-hide">
        {loading ? (
          <>
            <div className="font-bold text-2xl invisible pt-2">Books</div>
            {CustomSearchItemSkeleton ? (
              <CustomSearchItemSkeleton />
            ) : (
              <>
                {Array.from(Array(TOP_RESULTS_COUNT)).map((_, index) => (
                  <SearchItemSkeleton key={`search-item-skeleton-${index}`} />
                ))}
              </>
            )}
          </>
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
