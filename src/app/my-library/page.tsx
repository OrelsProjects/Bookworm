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

export default function MyLibrary(): React.ReactNode {
  const { sortBooks, filterBooks, nextPage, searchBooks, filteredBy } =
    useTable();
  const { booksLists } = useBooksList();

  const [userBookDataSorted, setUserBookDataSorted] = React.useState<
    UserBookData[]
  >([]);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);

  const onSortClick = (tabItem: TabItem) =>
    setUserBookDataSorted(sortBooks(tabItem.value as BookSort));

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
          <div className="flex flex-col gap-2">
            <div className="font-bold text-xl">Filter by</div>
            <Button
              key={`tab-filter-readlist`}
              onClick={(e) => {
                e.stopPropagation();
                setShowFilterDropdown(!showFilterDropdown);
              }}
              variant="outline"
              className="rounded-full flex-shrink-0 !min-w-20 h-6 p-2 w-max"
            >
              <div className="w-fit flex flex-row gap-1 justify-start items-center">
                <Filter.Fill className="!text-foreground" iconSize="xs" />
                Readlist
              </div>
            </Button>
            {showFilterDropdown && (
              <Dropdown
                items={booksLists.map((list) => {
                  return {
                    label: list.name,
                    leftIcon: (
                      <Checkbox
                        checked={
                          filteredBy?.filter === "readlist" &&
                          list.name === filteredBy.value
                        }
                        checkedComponent={undefined}
                        uncheckedComponent={undefined}
                      />
                    ),
                    onClick: () => onFilterClick(list.name),
                  };
                })}
                onClose={() => setShowFilterDropdown(false)}
              />
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
