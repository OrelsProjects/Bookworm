"use client";

import React, { useEffect, useRef } from "react";
import { SearchBar, Tabs } from "../../components";
import { filterTabItems, sorterTabItems } from "./_consts";
import { useDispatch, useSelector } from "react-redux";
import { selectUserBooks } from "../../lib/features/userBooks/userBooksSlice";
import BookThumbnail from "../../components/bookThumnail";
import {
  showBottomSheet,
  BottomSheetTypes,
} from "../../lib/features/modal/modalSlice";
import { Book, UserBookData } from "../../models";
import Title from "../../components/book/title";
import Authors from "../../components/book/authors";
import { Add } from "../../components/icons";
import { TabItem } from "../../components/tabs";
import useBook, { BookSort } from "../../hooks/useBook";
import useTable from "../../hooks/useTable";
import useScrollPosition from "../../hooks/useScrollPosition";
import { SearchBarComponent } from "../../components/search/searchBarComponent";

export default function MyLibrary(): React.ReactNode {
  const { scrollableDivRef } = useScrollPosition({
    onThreshold: () => nextPage(),
  });
  const { userBooks, sortBooks, nextPage, searchBooks } = useTable();

  const dispatch = useDispatch();
  const [userBookDataSorted, setUserBookDataSorted] = React.useState<
    UserBookData[]
  >([]);
  const [sortBy, setSortBy] = React.useState<BookSort>(BookSort.DateAdded);

  useEffect(() => {
    setUserBookDataSorted(sortBooks(sortBy, userBooks));
  }, [sortBy, userBooks]);

  const onBookClick = (book?: Book) =>
    dispatch(showBottomSheet({ book, type: BottomSheetTypes.BOOK_DETAILS }));

  const onSortClick = (tabItem: TabItem) =>
    setSortBy(tabItem.value as BookSort);

  const BookDetails = ({ book }: { book?: Book }) => {
    return (
      <div className="grid grid-cols-[auto_1fr_auto] gap-3 w-full h-34">
        <BookThumbnail
          book={book}
          className="!relative !w-20 !h-32" // Adjusted class names for consistency
          fill
        />
        <div className="flex flex-col gap-2 overflow-visible">
          <div className="flex flex-col">
            <Title title={book?.title ?? ""} className="font-sm" />
            <Authors authors={book?.authors} className="text-primary" />
          </div>
          <div className="line-clamp-3 text-sm font-light">
            {book?.description}
          </div>
        </div>
        <div
          className="flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Add.Fill className="w-9 h-9 !text-foreground" />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 pb-4">
      <SearchBarComponent
        onChange={(value: string) => searchBooks(value)}
        onSubmit={(value: string) => searchBooks(value)}
        placeholder="Search in Your Books..."
      />
      <div className="flex flex-col gap-0">
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
      <div
        className="flex flex-col gap-3 overflow-y-auto h-96 scrollbar-hide mt-4"
        ref={scrollableDivRef}
      >
        {userBookDataSorted
          .map((userBookdata) => userBookdata.bookData.book)
          ?.map((book) => (
            <div onClick={() => onBookClick(book)}>
              <BookDetails book={book} />
            </div>
          ))}
      </div>
    </div>
  );
}
