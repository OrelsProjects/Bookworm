"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import Tabs from "@/src/components/ui/tabs";
import { sorterTabItems } from "../_consts";
import { UserBookData } from "@/src/models";
import { TabItem } from "@/src/components/ui/tabs";
import { BookFilter, BookSort } from "@/src/hooks/useBook";
import useTable from "@/src/hooks/useTable";
import { SearchBarComponent } from "@/src/components/search/searchBarComponent";
import BookList from "@/src/components/book/bookList";
import Dropdown from "@/src/components/ui/dropdown";
import useBooksList from "@/src/hooks/useBooksList";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Filter } from "@/src/components/icons/filter";
import { ExpandType } from "@/src/components/animationDivs";

export default function MyLibrary(): React.ReactNode {
  const {
    nextPage,
    sortBooks,
    userBooks,
    filteredBy,
    filterBooks,
    searchBooks,
  } = useTable();
  const { booksLists } = useBooksList();

  const [userBookDataSorted, setUserBookDataSorted] = React.useState<
    UserBookData[]
  >([]);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);

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
        <div className="absolute top-full left-0 mt-1 z-40">
          <Dropdown
            className="!w-fit min-w-[40%] max-w-[70%] max-h-56 overflow-auto"
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
      <SearchBarComponent
        onChange={(value: string) => searchBooks(value)}
        onSubmit={(value: string) => searchBooks(value)}
        placeholder="Search in Your Books..."
        className="pr-16"
      />

      <div className="h-full flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Tabs
            Title={() => <div className="font-bold text-xl">Sort by</div>}
            items={sorterTabItems}
            onClick={onSortClick}
          />
          <div className="flex flex-col gap-1 relative">
            <div className="font-bold text-xl">Filter by</div>
            <ListFilter filter="readlist" />
          </div>
        </div>
        <BookList
          readStatus="read"
          onNextPageScroll={nextPage}
          direction="column"
          thumbnailSize="md"
          disableScroll
          showAdd
        />
      </div>
    </div>
  );
}
