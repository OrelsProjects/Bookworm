import React from "react";
import { Book } from "../../models";
import { useDispatch, useSelector } from "react-redux";
import {
  showBottomSheet,
  BottomSheetTypes,
} from "../../lib/features/modal/modalSlice";
import useScrollPosition, {
  ScrollDirection,
} from "../../hooks/useScrollPosition";
import { BooksListData } from "../../models/booksList";
import ReadListThumbnail from "./readListThumbnail";
import { selectBooksLists } from "../../lib/features/booksLists/booksListsSlice";

type BookListProps = {
  className?: string;
  direction: "row" | "column";
  onNextPageScroll?: () => void;
  bookThumbnailSize?: "small" | "medium" | "large";
};

const ReadList: React.FC<BookListProps> = ({
  className,
  onNextPageScroll,
  bookThumbnailSize,
}) => {
  const { booksListsData } = useSelector(selectBooksLists);
  const { scrollableDivRef } = useScrollPosition({
    onThreshold: () => onNextPageScroll?.(),
    scrollDirection: ScrollDirection.Height,
  });

  return (
    <div
      className={`flex gap-3 overflow-auto h-72 flex-col scrollbar-hide ${className}`}
      ref={scrollableDivRef}
    >
      {booksListsData?.map((booksListData) => (
        <div className="w-full h-full flex flex-row gap-2">
          <ReadListThumbnail books={booksListData?.booksInList ?? []} />
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

export default ReadList;
