"use client";

import React, { useEffect } from "react";
import useSearch, { UseSearchResult } from "../../hooks/useSearch";
import BookSearchResult, { SearchItemSkeleton } from "./BookSearchResult";
import { toast } from "react-toastify";
import {
  SearchBarComponent,
  SearchBarComponentProps,
} from "./searchBarComponent";
import { Skeleton } from "../ui/skeleton";

const TOP_RESULTS_COUNT = 10;

export type SearchBarProps = {
  CustomSearchItem?: typeof BookSearchResult;
  CustomSearchItemSkeleton?: React.FC;
  className?: string;
  autoFocus?: boolean;
  onChange?: (text: string, previous?: string) => void;
  onSubmit?: (text: string) => void;
  onSearch?: (text: string) => void;
  onFocus?: () => any;
  onEmpty?: () => any;
  onBlur?: (value: string) => any;
} & SearchBarComponentProps;

const SearchBar: React.FC<SearchBarProps> = ({
  CustomSearchItemSkeleton,
  CustomSearchItem,
  className,
  autoFocus,
  onChange,
  onSearch,
  onSubmit,
  onFocus,
  onEmpty,
  onBlur,
  ...props
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

  const handleSubmit = (value: string) => {
    onSubmit?.(value);
    updateSearchValue(value);
  };

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
      className={`w-full flex flex-col
      ${(loading || books?.length) ?? 0 > 0 ? " gap-4 " : ""}`}
    >
      <SearchBarComponent
        onBlur={onBlur}
        onSubmit={handleSubmit}
        onChange={handleOnChange}
        className={`w-full pr-[72px] transition-all duration-300 ease-in-out rounded-full ${
          className ?? ""
        }`}
        formClassName="w-full"
        placeholder="Search all books, authors..."
        autoFocus={autoFocus}
        onFocus={onFocus}
        {...props}
      />
      <div className="flex flex-col gap-3">
        {loading ? (
          <>
            <Skeleton className="w-14 h-5 mt-5 rounded-full" />
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
            <div className="flex flex-col gap-2 mt-3">
              <div className="font-bold text-2xl">Books</div>
              <div className="flex 3 flex-col gap-6">
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
