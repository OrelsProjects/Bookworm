"use client";

import React, { useEffect } from "react";
import { Tabs } from "../../components";
import { filterTabItems, sorterTabItems } from "./_consts";
import { UserBookData } from "../../models";
import { TabItem } from "../../components/tabs";
import { BookSort } from "../../hooks/useBook";
import useTable from "../../hooks/useTable";
import useScrollPosition from "../../hooks/useScrollPosition";
import { SearchBarComponent } from "../../components/search/searchBarComponent";
import BookList from "../../components/book/bookList";
import { ThumbnailSize } from "../../consts/thumbnail";

export default function MyLibrary(): React.ReactNode {
  const { userBooks, sortBooks, nextPage, searchBooks } = useTable();
  const [userBookDataSorted, setUserBookDataSorted] = React.useState<
    UserBookData[]
  >([]);

  const [sortBy, setSortBy] = React.useState<BookSort>(BookSort.DateAdded);

  useEffect(() => {
    setUserBookDataSorted(sortBooks(sortBy, userBooks));
  }, [sortBy, userBooks]);

  const onSortClick = (tabItem: TabItem) =>
    setSortBy(tabItem.value as BookSort);

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
        <Tabs
          Title={() => <div className="font-bold text-xl">Filter by</div>}
          items={filterTabItems}
        />
      </div>
      <BookList
        books={userBookDataSorted.map((ubd) => ubd.bookData.book)}
        onNextPageScroll={nextPage}
        direction="column"
        bookThumbnailSize={ThumbnailSize.Small}
        disableScroll
      />
    </div>
  </div>
  
  );
}
