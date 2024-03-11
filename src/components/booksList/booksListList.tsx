import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { showModal, ModalTypes } from "../../lib/features/modal/modalSlice";
import useScrollPosition, {
  ScrollDirection,
} from "../../hooks/useScrollPosition";
import BooksListThumbnail from "./booksListThumbnail";
import { BooksListData } from "../../models/booksList";
import { ThumbnailSize } from "../../consts/thumbnail";
import { useRouter } from "next/navigation";
import { Checkbox } from "../checkbox";
import { Checkmark, BurgerLines, Circle, Add, Share } from "../icons";
import { Book } from "../../models";
import { isBooksEqual } from "../../utils/bookUtils";
import { CommentsArea } from "../modal/_components/commentsArea";

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
  const dispatch = useDispatch();

  const { scrollableDivRef } = useScrollPosition({
    onThreshold: () => onNextPageScroll?.(),
    scrollDirection: ScrollDirection.Height,
  });

  const onListClick = (booksListData: BooksListData) =>
    dispatch(
      showModal({
        data: booksListData,
        type: ModalTypes.BOOKS_LIST_DETAILS,
      })
    );

  const isBookInList = useCallback(
    (listData: BooksListData): boolean =>
      !!listData.booksInList?.some((bookInList) =>
        isBooksEqual(bookInList.book, endElementProps?.book)
      ),
    [endElementProps?.book]
  );

  return (
    <div
      className={`flex gap-2 h-fit flex-col scrollbar-hide ${className ?? ""}
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
            />
            <div className="flex flex-col w-full flex-shrink">
              <div className="text-lg font-semibold">{listData.name}</div>
              <div className="text-sm font-light line-clamp-3">
                {listData.description}
              </div>
              {bottomElementProps && (
                <div className="w-full flex flex-row justify-end self-end  mt-auto ml-auto gap-6">
                  <div className="flex flex-col gap-0 justify-center items-center">
                    <Add.Fill
                      iconSize="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        bottomElementProps.onAddBookClick(listData);
                      }}
                      className="!text-foreground"
                    />
                    <div className="text-sm text-foreground">Add Book</div>
                  </div>
                  <div className="flex flex-col gap-0 justify-center items-center">
                    <Share.Fill
                      iconSize="xs"
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
