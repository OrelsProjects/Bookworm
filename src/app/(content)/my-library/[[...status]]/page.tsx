"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { Button } from "../../../../components/ui/button";
import Tabs from "../../../../components/ui/tabs";
import { sorterTabItems } from "../_consts";
import { Book, UserBookData } from "../../../../models";
import { TabItem } from "../../../../components/ui/tabs";
import { BookFilter, BookSort } from "../../../../hooks/useBook";
import useTable from "../../../../hooks/useTable";
import { SearchBarComponent } from "../../../../components/search/searchBarComponent";
import BookList from "../../../../components/book/bookList";
import Dropdown from "../../../../components/ui/dropdown";
import useBooksList from "../../../../hooks/useBooksList";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Filter } from "../../../../components/icons/filter";
import { ExpandType } from "../../../../components/animationDivs";
import { ReadStatus } from "../../../../models/readingStatus";
import { FaBars } from "react-icons/fa6";
import useScrollPosition from "../../../../hooks/useScrollPosition";

export default function MyLibrary({
  params,
}: {
  params: { status?: string };
}): React.ReactNode {
  const {
    nextPage,
    sortBooks,
    userBooks,
    filteredBy,
    filterBooks,
    searchBooks,
  } = useTable((params.status?.[0] || "to-read") as ReadStatus);
  const { scrollableDivRef } = useScrollPosition({
    lowerThreshold: 60,
    upperThreshold: 90,
    onThreshold: nextPage,
  });
  const { booksLists } = useBooksList();

  const [userBookDataSorted, setUserBookDataSorted] = React.useState<
    UserBookData[]
  >([]);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);

  useEffect(() => {
    setUserBookDataSorted(userBooks);
  }, [userBooks]);

  const books = useMemo((): Book[] => {
    return userBookDataSorted
      .map((ubd) => ubd.bookData.book)
      .filter((book) => book !== undefined) as Book[];
  }, [userBookDataSorted]);

  const title = useMemo(() => {
    switch (params.status?.[0]) {
      case "read":
        return "Books I've read";
      case "to-read":
        return "Next read";
      default:
        return "Next read";
    }
  }, [params.status]);

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
              ${filteredBy.length > 0 ? "bg-primary" : ""}
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
      />

      <div
        className="h-full flex flex-col gap-[30px] overflow-auto"
        ref={scrollableDivRef}
      >
        <div className="flex flex-col gap-[25px]">
          <Tabs
            Title={() => <div className="text-2xl">Sort by</div>}
            items={sorterTabItems}
            onClick={onSortClick}
            selectable
          />
          <div className="flex flex-col gap-2.5 relative">
            <div className="text-2xl">Filter by</div>
            <ListFilter filter="readlist" />
          </div>
        </div>
        <div className="flex flex-col gap-[25px]">
          <div className="flex flex-row gap-1 justify-start items-center">
            <FaBars className="w-[17.5px] h-[15px]" />
            <span className="text-2xl">{title}</span>
          </div>
          <BookList
            books={books}
            onNextPageScroll={nextPage}
            direction="column"
            thumbnailSize="md"
            disableScroll
            showAdd
          />
        </div>
      </div>
    </div>
  );
}
