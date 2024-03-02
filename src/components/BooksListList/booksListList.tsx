import React from "react";
import { Book } from "../../models";
import { useDispatch, useSelector } from "react-redux";
import {
  showModal,
  BottomSheetTypes,
} from "../../lib/features/modal/modalSlice";
import useScrollPosition, {
  ScrollDirection,
} from "../../hooks/useScrollPosition";
import BooksListThumbnail from "./booksListThumbnail";
import { selectBooksLists } from "../../lib/features/booksLists/booksListsSlice";
import { BooksListData } from "../../models/booksList";

type BookListProps = {
  className?: string;
  direction: "row" | "column";
  onNextPageScroll?: () => void;
  bookThumbnailSize?: "small" | "medium" | "large";
};

const BooksListList: React.FC<BookListProps> = ({
  className,
  onNextPageScroll,
  bookThumbnailSize,
}) => {
  const dispatch = useDispatch();
  const { booksListsData } = useSelector(selectBooksLists);
  const { scrollableDivRef } = useScrollPosition({
    onThreshold: () => onNextPageScroll?.(),
    scrollDirection: ScrollDirection.Height,
  });

  const onListClick = (booksListData: BooksListData) =>
    dispatch(
      showModal({
        data: booksListData,
        type: BottomSheetTypes.BOOKS_LIST_DETAILS,
      })
    );

  return (
    <div
      className={`flex gap-3 overflow-auto h-72 flex-col scrollbar-hide ${className}`}
      ref={scrollableDivRef}
    >
      {booksListsData?.map((booksListData) => (
        <div
          className="w-full h-full flex flex-row gap-2"
          onClick={() => onListClick(booksListData)}
          key={`books-list-${booksListData.listId}`}
        >
          <BooksListThumbnail books={booksListData?.booksInList ?? []} />
          <div className="flex flex-col">
            <div className="text-lg font-semibold">{booksListData.name}</div>
            <div className="text-sm font-light">
              {booksListData.description}
            </div>
            <div></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BooksListList;
