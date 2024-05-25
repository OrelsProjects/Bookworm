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
import { useAppSelector } from "../../lib/hooks";

const MAX_RESULTS_NO_SEE_ALL = 4;

export type SearchBarProps = {
  CustomSearchItemSkeleton?: React.FC;
  CustomSearchItem?: typeof SearchResultComponent;
  clearOnExit?: boolean; // Clear redux state on exit. Used for when navigating to a new page that uses the search data.
  booksFirst?: boolean;
  booksOnly?: boolean;
  className?: string;
  autoFocus?: boolean;
  limit?: number;
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
  limit,
  ...props
}: SearchBarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const searchHook = booksOnly
    ? useSearchBooks({ limit })
    : useSearch({ clearOnExit: !booksOnly, limit });

  const scrollbarRef = React.useRef<HTMLDivElement>(null);

  const [seeAllBooks, setSeeAllBooks] = React.useState(false);
  const [seeAllLists, setSeeAllLists] = React.useState(false);

  useEffect(() => {
    if (searchHook.error) {
      toast.error("Failed to fetch books");
    }
  }, [searchHook.error]);

  const isLoading = useMemo(
    () => searchHook.status === "loading",
    [searchHook.status]
  );

  useEffect(() => {
    if (searchHook.status === "loading") {
      onSearch?.(searchHook.searchValue);
    }
  }, [searchHook.status]);

  const scrollToTop = () => {
    // scroll to top smoothly
    scrollbarRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = (value: string) => {
    onSubmit?.(value);
    searchHook.search(value);
  };

  const handleOnChange = (value: string) => {
    if (!value) {
      onEmpty?.();
      setSeeAllBooks(false);
      setSeeAllLists(false);
    } else {
      onFocus?.();
      scrollToTop();
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

  const itemsToShowBooksCount = useMemo(() => {
    return booksOnly
      ? 10
      : seeAllBooks
      ? books?.length
      : MAX_RESULTS_NO_SEE_ALL;
  }, [seeAllBooks, books]);

  const itemsToShowListsCount = useMemo(() => {
    return seeAllLists ? lists?.length : MAX_RESULTS_NO_SEE_ALL;
  }, [seeAllLists, lists]);

  const shouldShowBooks = useMemo(
    () =>
      (isLoading || (!isLoading && (books?.length || 0) > 0)) && !seeAllLists,
    [isLoading, books, seeAllLists]
  );

  const shouldShowLists = useMemo(
    () =>
      !booksOnly &&
      (isLoading || (!isLoading && (lists?.length || 0) > 0)) &&
      !seeAllBooks,
    [isLoading, lists, seeAllBooks]
  );

  const ListsComponent = () => (
    <div className="flex flex-col gap-[15px]">
      {(lists?.length || 0) > 0 && (
        <SeeAll
          title="Readlists"
          onClick={() => {
            setSeeAllLists(!seeAllLists);
          }}
          showSeeAll={(lists?.length || 0) > (itemsToShowListsCount || 0)}
          loading={isLoading}
        />
      )}
      <div className="flex flex-col gap-[22px]">
        {isLoading
          ? Array.from(Array(MAX_RESULTS_NO_SEE_ALL)).map((_, index) => (
              <SearchItemSkeleton key={`search-item-skeleton-books-${index}`} />
            ))
          : lists
              ?.slice(0, itemsToShowListsCount)
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
        <SeeAllTitle title="Books" loading={isLoading} />
      ) : (
        <SeeAll
          title={"Books"}
          onClick={() => {
            setSeeAllBooks(!seeAllBooks);
          }}
          loading={isLoading}
        />
      )}
      <div className="flex flex-col gap-[22px]">
        {isLoading
          ? Array.from(Array(MAX_RESULTS_NO_SEE_ALL)).map((_, index) => (
              <SearchItemSkeleton
                key={`search-item-skeleton-books-lists-${index}`}
              />
            ))
          : books
              ?.slice(0, itemsToShowBooksCount)
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
    <div
      className={cn("h-fit max-h-full w-full flex flex-col flex-shrink-0", {
        "md:h-full": seeAllBooks || seeAllLists,
        "h-full":
          searchHook.status !== "idle" &&
          searchHook.status !== "error" &&
          searchHook.searchValue,
      })}
    >
      <SearchBarComponent
        onBlur={onBlur}
        onSubmit={handleSubmit}
        onChange={handleOnChange}
        className={`w-full transition-all duration-300 ease-in-out rounded-full ${
          className ?? ""
        }`}
        formClassName={cn(
          "h-fit max-h-full w-full absolute inset-0 z-20 bg-background pr-[72px]",
          {
            "md:pr-0": user,
          }
        )}
        placeholder="Search all books, authors..."
        autoFocus={autoFocus}
        onFocus={onFocus}
        {...props}
      />
      {searchHook.status !== "idle" && (
        <div
          className={cn("h-full flex flex-col gap-3 overflow-auto", {
            "mt-[88px]": !booksOnly && searchHook.searchValue,
            "mt-4": booksOnly,
          })}
          ref={scrollbarRef}
        >
          <div
            className={cn("h-fit flex 3 flex-col gap-8", {
              "flex-col-reverse": booksFirst,
            })}
          >
            {shouldShowLists && <ListsComponent />}
            {shouldShowBooks && <BooksComponent />}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
