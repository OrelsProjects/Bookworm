import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import useScrollPosition, {
  ScrollDirection,
} from "../../hooks/useScrollPosition";
import BooksListThumbnail from "./booksListThumbnail";
import { BooksListData } from "../../models/booksList";
import { ThumbnailSize } from "../../consts/thumbnail";
import { Checkbox } from "../checkbox";
import { Checkmark } from "../icons/checkmark";
import { Circle } from "../icons/circle";
import { Add } from "../icons/add";
import { Share } from "../icons/share";
import { Book } from "../../models";
import { isBooksEqual } from "../../utils/bookUtils";
import { CommentsArea } from "../modal/_components/commentsArea";
import { selectAuth } from "../../lib/features/auth/authSlice";
import { useModal } from "../../hooks/useModal";

interface EndElementProps {
  onEndElementClick: (booksList: BooksListData) => void;
  book: Book;
}

interface BottomElementProps {
  onShareClick: (booksList: BooksListData) => void;
  onAddBookClick: (booksList: BooksListData) => void;
}

interface BookListListProps {
  className?: string;
  direction: "row" | "column";
  onNextPageScroll?: () => void;
  bookThumbnailSize?: ThumbnailSize;
  disableScroll?: boolean;
  booksListsData?: BooksListData[];
}

type Props = BookListListProps & { endElementProps?: EndElementProps } & {
  bottomElementProps?: BottomElementProps;
};

const BooksListList: React.FC<Props> = ({
  className,
  onNextPageScroll,
  bookThumbnailSize,
  disableScroll,
  booksListsData,
  bottomElementProps,
  endElementProps,
}) => {
  const { user } = useSelector(selectAuth);
  const { showBookInListDetailsModal } = useModal();
  const { scrollableDivRef } = useScrollPosition({
    onThreshold: () => onNextPageScroll?.(),
    scrollDirection: ScrollDirection.Height,
  });

  const onListClick = (booksListData: BooksListData) =>
    showBookInListDetailsModal({
      ...booksListData,
      curatorName: user?.displayName,
    });

  const isBookInList = useCallback(
    (listData: BooksListData): boolean =>
      !!listData.booksInList?.some((bookInList) =>
        isBooksEqual(bookInList.book, endElementProps?.book)
      ),
    [endElementProps?.book]
  );

  return (
    <div
      className={`flex gap-6 h-fit flex-col scrollbar-hide ${className ?? ""}
      ${disableScroll ? "" : "overflow-auto"} relative`}
      ref={scrollableDivRef}
    >
      {booksListsData?.map((listData) => (
        <div
          className="h-full w-full flex flex-col gap-2"
          key={`books-list-${listData.listId}`}
        >
          <div
            className="w-full h-full flex flex-row gap-2"
            onClick={() => onListClick(listData)}
            key={`books-list-${listData.listId}`}
          >
            <BooksListThumbnail
              books={
                listData?.booksInList?.map((bookInList) => bookInList.book) ??
                []
              }
              alt={`${listData.name} list thumbnail`}
              className="flex-shrink-0"
              thumbnailSize={bookThumbnailSize}
            />
            <div className="flex flex-col w-full flex-shrink">
              <div className="text-lg font-semibold line-clamp-1">
                {listData.name}
              </div>
              <div className="text-sm font-light line-clamp-3">
                {listData.description}
              </div>
              {bottomElementProps && (
                <div className="w-full flex flex-row justify-end self-end  mt-auto ml-auto gap-6">
                  <div className="flex flex-col gap-0 justify-center items-center">
                    <Add.Fill
                      className="!text-background bg-foreground rounded-full p-1"
                      iconSize="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        bottomElementProps.onAddBookClick(listData);
                      }}
                    />
                    <div className="text-sm text-foreground">Add Book</div>
                  </div>
                  <div className="flex flex-col gap-0 justify-center items-center">
                    <Share.Fill
                      iconSize="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        bottomElementProps.onShareClick(listData);
                      }}
                      className="!text-foreground"
                    />
                    <div className="text-sm text-foreground">Share Link</div>
                  </div>
                </div>
              )}
            </div>
            {endElementProps && (
              <div
                className="flex flex-col justify-center items-center ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  endElementProps.onEndElementClick(listData);
                }}
              >
                <Checkbox
                  checkedComponent={<Checkmark.Fill iconSize="lg" />}
                  uncheckedComponent={
                    <Circle.Fill iconSize="lg" className="!text-foreground" />
                  }
                  checked={isBookInList(listData)}
                />
              </div>
            )}
          </div>
          {isBookInList(listData) && (
            <CommentsArea
              className="w-full"
              bookInList={listData.booksInList?.find((bookInList) =>
                isBooksEqual(bookInList.book, endElementProps?.book)
              )}
              placeholder="Leave your comment here..."
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default BooksListList;
