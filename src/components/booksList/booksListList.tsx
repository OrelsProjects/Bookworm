import React from "react";
import { useDispatch } from "react-redux";
import {
  showModal,
  BottomSheetTypes,
} from "../../lib/features/modal/modalSlice";
import useScrollPosition, {
  ScrollDirection,
} from "../../hooks/useScrollPosition";
import BooksListThumbnail from "./booksListThumbnail";
import { BooksListData } from "../../models/booksList";
import { ThumbnailSize } from "../../consts/thumbnail";

type BookListProps = {
  className?: string;
  direction: "row" | "column";
  onNextPageScroll?: () => void;
  bookThumbnailSize?: ThumbnailSize;
  disableScroll?: boolean;
  booksListsData?: BooksListData[];
};

const BooksListList: React.FC<BookListProps> = ({
  className,
  onNextPageScroll,
  bookThumbnailSize,
  disableScroll,
  booksListsData,
}) => {
  const dispatch = useDispatch();

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
      className={`flex gap-2 h-full flex-col scrollbar-hide ${className}
      ${disableScroll ? "" : "overflow-auto"}`}
      ref={scrollableDivRef}
    >
      {booksListsData?.map((booksListData) => (
        <div className="h-full">
          <div
            className="w-full h-full flex flex-row gap-2"
            onClick={() => onListClick(booksListData)}
            key={`books-list-${booksListData.listId}`}
          >
            <BooksListThumbnail
              books={
                booksListData?.booksInList?.map(
                  (bookInList) => bookInList.book
                ) ?? []
              }
            />
            <div className="flex flex-col">
              <div className="text-lg font-semibold">{booksListData.name}</div>
              <div className="text-sm font-light">
                {booksListData.description}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BooksListList;
