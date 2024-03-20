"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { Button } from "../../components/button";
import Tabs from "../../components/tabs";
import { sorterTabItems } from "./_consts";
import { UserBookData } from "../../models";
import { TabItem } from "../../components/tabs";
import { BookFilter, BookSort } from "../../hooks/useBook";
import useTable from "../../hooks/useTable";
import { SearchBarComponent } from "../../components/search/searchBarComponent";
import BookList from "../../components/book/bookList";
import Dropdown from "../../components/dropdown";
import useBooksList from "../../hooks/useBooksList";
import { Checkbox } from "../../components/checkbox";
import { Filter } from "../../components/icons/filter";
import { ExpandType } from "../../components/animationDivs";
import SearchBarIcon from "../../components/search/searchBarIcon";

export default function MyLibrary(): React.ReactNode {
  const {
    sortBooks,
    filterBooks,
    nextPage,
    searchBooks,
    filteredBy,
    userBooks,
  } = useTable();
  const { booksLists } = useBooksList();

  const [userBookDataSorted, setUserBookDataSorted] = React.useState<
    UserBookData[]
  >([]);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);

  // return <Loading spinnerClassName="w-20 h-20" />;

  useEffect(() => {
    setUserBookDataSorted(userBooks);
  }, [userBooks]);

  const onSortClick = (tabItem: TabItem) => {
    const filteredBooks = filterBooks(undefined, undefined, booksLists);
    setUserBookDataSorted(sortBooks(tabItem.value as BookSort, filteredBooks));
  };

  const onFilterClick = (value: string) =>
    setUserBookDataSorted(filterBooks("readlist", value, booksLists));

  const filterStatusDropdownText = useMemo(() => {
    const filters = filteredBy.filter((f) => f.filter === "status");
    if (filters.length === 0) return "Status";
    if (filters.length === 1) return filteredBy[0].value;
    return `Multi-status`;
  }, [filteredBy]);

  const filterReadlistDropdownText = useMemo(() => {
    const filters = filteredBy.filter((f) => f.filter === "readlist");
    if (filters.length === 0) return "Readlist";
    if (filters.length === 1) return filteredBy[0].value;
    return `Multi-readlists`;
  }, [filteredBy]);

  const getFilterDropdownText = useCallback(
    (filter: BookFilter) => {
      switch (filter) {
        case "status":
          return filterStatusDropdownText;
        case "readlist":
          return filterReadlistDropdownText;
      }
    },
    [filterStatusDropdownText, filterReadlistDropdownText]
  );

  const ListFilter = ({ filter }: { filter: BookFilter }) => (
    <>
      <Button
        key={`tab-filter-${filter}`}
        onClick={(e) => {
          e.stopPropagation();
          setShowFilterDropdown(!showFilterDropdown);
        }}
        variant="outline"
        className={`rounded-full flex-shrink-0 !min-w-20 h-6 p-4 w-max max-w-[70%]
              ${filteredBy.length > 0 ? "border-none bg-primary" : ""}
              `}
      >
        <div className="w-fit flex flex-row gap-1 justify-start items-center truncate">
          <Filter.Fill
            className="!text-foreground flex-shrink-0"
            iconSize="xs"
          />
          {getFilterDropdownText(filter)}
        </div>
      </Button>
      {showFilterDropdown && (
        <div className="absolute top-full left-0 mt-1 z-50">
          <Dropdown
            className="!w-fit max-w-[70%]"
            expandType={ExpandType.TopRight}
            closeOnSelection={false}
            items={booksLists.map((list) => {
              return {
                label: list.name,
                leftIcon: (
                  <Checkbox
                    className="h-4 w-4 flex-shrink-0"
                    checked={
                      filteredBy.find(
                        (f) => f.filter === filter && f.value === list.name
                      )
                        ? true
                        : false
                    }
                  />
                ),
                onClick: () => onFilterClick(list.name),
              };
            })}
            onClose={() => setShowFilterDropdown(false)}
          />
        </div>
      )}
    </>
  );

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <SearchBarIcon>
        <SearchBarComponent
          onChange={(value: string) => searchBooks(value)}
          onSubmit={(value: string) => searchBooks(value)}
          placeholder="Search in Your Books..."
        />
      </SearchBarIcon>

      <div className="h-full overflow-auto scrollbar-hide flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <Tabs
            Title={() => <div className="font-bold text-xl">Sort by</div>}
            items={sorterTabItems}
            onClick={onSortClick}
          />
          <div className="flex flex-col gap-2 relative">
            <div className="font-bold text-xl">Filter by</div>
            <ListFilter filter="readlist" />
          </div>
        </div>
        <BookList
          books={userBookDataSorted.map((ubd) => ubd.bookData.book)}
          onNextPageScroll={nextPage}
          direction="column"
          thumbnailSize="sm"
          disableScroll
        />
      </div>
    </div>
  );
}
