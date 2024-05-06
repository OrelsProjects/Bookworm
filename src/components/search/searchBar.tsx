"use client";

import React, { useEffect, useMemo } from "react";
import useSearch from "../../hooks/useSearch";
import SearchResultComponent, {
  SearchItemSkeleton,
} from "./searchResultComponent";
import { toast } from "react-toastify";
import {
  SearchBarComponent,
  SearchBarComponentProps,
} from "./searchBarComponent";
import { cn } from "../../lib/utils";
import useSearchBooks from "../../hooks/useSearchBooks";
import { SearchResults } from "../../models/search";
import { Book } from "../../models";
import { SafeBooksListData } from "../../models/booksList";
import { SeeAll, SeeAllTitle } from "../ui/seeAll";

const TOP_RESULTS_COUNT = 10;

export type SearchBarProps = {
  CustomSearchItemSkeleton?: React.FC;
  CustomSearchItem?: typeof SearchResultComponent;
  clearOnExit?: boolean; // Clear redux state on exit. Used for when navigating to a new page that uses the search data.
  booksFirst?: boolean;
  booksOnly?: boolean;
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
  clearOnExit,
  booksFirst,
  className,
  autoFocus,
  booksOnly,
  onChange,
  onSearch,
  onSubmit,
  onFocus,
  onEmpty,
  onBlur,
  ...props
}: SearchBarProps) => {
  const searchHook = booksOnly
    ? useSearchBooks()
    : useSearch({ clearOnExit: !booksOnly });

  useEffect(() => {
    if (searchHook.error) {
      toast.error("Failed to fetch books");
    }
  }, [searchHook.error]);

  useEffect(() => {
    if (searchHook.status === "loading") {
      onSearch?.(searchHook.searchValue);
    }
  }, [searchHook.status]);

  const handleSubmit = (value: string) => {
    onSubmit?.(value);
    searchHook.search(value);
  };

  const handleOnChange = (value: string) => {
    if (!value) {
      onEmpty?.();
    } else {
      onFocus?.();
    }
    onChange?.(value, searchHook.searchValue);
    searchHook.search(value);
  };

  const books: Book[] = useMemo(
    () =>
      booksOnly
        ? (searchHook.results as Book[])
        : (searchHook.results as SearchResults)?.books,
    [booksOnly, searchHook.results]
  );

  const lists: SafeBooksListData[] | undefined = useMemo(() => {
    return booksOnly ? undefined : (searchHook.results as SearchResults)?.lists;
  }, [booksOnly, searchHook.results]);

  const ListsComponent = () => (
    <div className="flex flex-col gap-[15px]">
      <SeeAll
        title="Readlists"
        onClick={() => {}}
        loading={searchHook.status === "loading"}
      />
      <div className="flex flex-col gap-[22px]">
        {searchHook.status === "loading"
          ? Array.from(Array(3)).map((_, index) => (
              <SearchItemSkeleton key={`search-item-skeleton-books-${index}`} />
            ))
          : lists
              ?.slice(0, TOP_RESULTS_COUNT)
              .map((list, i) => (
                <SearchResultComponent
                  key={`search-result-list-${list.name}`}
                  booksList={list}
                />
              ))}
      </div>
    </div>
  );

  const BooksComponent = () => (
    <div className="flex flex-col gap-[15px]">
      {booksOnly ? (
        <SeeAllTitle title="Books" loading={searchHook.status === "loading"} />
      ) : (
        <SeeAll
          title={"Books"}
          onClick={() => {}}
          loading={searchHook.status === "loading"}
        />
      )}
      <div className="flex flex-col gap-[22px]">
        {searchHook.status === "loading"
          ? Array.from(Array(3)).map((_, index) => (
              <SearchItemSkeleton
                key={`search-item-skeleton-books-lists-${index}`}
              />
            ))
          : books
              ?.slice(0, TOP_RESULTS_COUNT)
              .map((book, i) =>
                CustomSearchItem ? (
                  <CustomSearchItem
                    key={`search-result-book-${book.title}`}
                    book={book}
                  />
                ) : (
                  <SearchResultComponent
                    key={
                      book.title + book.isbn10 + book.datePublished + book.isbn
                    }
                    book={book}
                  />
                )
              )}
      </div>
    </div>
  );

  return (
    <div className={`h-fit max-h-full w-full flex flex-col`}>
      <SearchBarComponent
        onBlur={onBlur}
        onSubmit={handleSubmit}
        onChange={handleOnChange}
        className={`w-full pr-[72px] transition-all duration-300 ease-in-out rounded-full ${
          className ?? ""
        }`}
        formClassName="h-fit max-h-full w-full absolute inset-0 z-20 bg-background overflow-auto pr-[72px]"
        placeholder="Search all books, authors..."
        autoFocus={autoFocus}
        onFocus={onFocus}
        {...props}
      />
      {searchHook.status !== "idle" && (
        <div
          className={cn("h-full flex flex-col gap-3 overflow-auto", {
            "mt-[88px]": !booksOnly,
            "mt-4": booksOnly,
          })}
        >
          <div
            className={cn("h-full flex 3 flex-col gap-8 overflow-auto", {
              "flex-col-reverse": booksFirst,
            })}
          >
            {!booksOnly && <ListsComponent />}
            <BooksComponent />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
