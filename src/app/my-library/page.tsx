"use client";

import React, { useEffect } from "react";
import { Button, Tabs } from "../../components";
import { sorterTabItems } from "./_consts";
import { UserBookData } from "../../models";
import { TabItem } from "../../components/tabs";
import { BookSort } from "../../hooks/useBook";
import useTable from "../../hooks/useTable";
import { SearchBarComponent } from "../../components/search/searchBarComponent";
import BookList from "../../components/book/bookList";
import Dropdown from "../../components/dropdown";
import useBooksList from "../../hooks/useBooksList";
import { Checkbox } from "../../components/checkbox";
import { Filter } from "../../components/icons";
import { ExpandType } from "../../components/animationDivs";

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

  useEffect(() => {
    setUserBookDataSorted(userBooks);
  }, [userBooks]);

  const onSortClick = (tabItem: TabItem) => {
    const filteredBooks = filterBooks(undefined, undefined, booksLists);
    setUserBookDataSorted(sortBooks(tabItem.value as BookSort, filteredBooks));
  };

  const onFilterClick = (value: string) =>
    setUserBookDataSorted(filterBooks("readlist", value, booksLists));

  return (
    <div className="w-full h-full grid grid-rows-[auto,1fr] gap-5">
      <SearchBarComponent
        onChange={(value: string) => searchBooks(value)}
        onSubmit={(value: string) => searchBooks(value)}
        placeholder="Search in Your Books..."
      />
      <div className="overflow-auto scrollbar-hide flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <Tabs
            Title={() => <div className="font-bold text-xl">Sort by</div>}
            items={sorterTabItems}
            onClick={onSortClick}
          />
          <div className="flex flex-col gap-2 relative">
            <div className="font-bold text-xl">Filter by</div>
            <Button
              key={`tab-filter-readlist`}
              onClick={(e) => {
                e.stopPropagation();
                setShowFilterDropdown(!showFilterDropdown);
              }}
              variant="outline"
              className={`rounded-full flex-shrink-0 !min-w-20 h-6 p-2 w-max
                ${filteredBy.length > 0 ? "border-none bg-primary" : ""}
              `}
            >
              <div className="w-fit flex flex-row gap-1 justify-start items-center">
                <Filter.Fill className="!text-foreground" iconSize="xs" />
                Readlist
              </div>
            </Button>
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-1 z-50">
                <Dropdown
                  className="!w-fit"
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
                              (f) =>
                                f.filter === "readlist" && f.value === list.name
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
