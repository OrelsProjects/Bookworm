import React, { useCallback } from "react";
import useScrollPosition from "../../hooks/useScrollPosition";
import BooksListThumbnail from "./booksListThumbnail";
import { BooksListData } from "../../models/booksList";
import { ThumbnailSize } from "../../consts/thumbnail";
import { Checkbox } from "../ui/checkbox";
import { Checkmark } from "../icons/checkmark";
import { Circle } from "../icons/circle";
import { Add } from "../icons/add";
import { Share } from "../icons/share";
import { Book } from "../../models";
import { isBooksEqual } from "../../utils/bookUtils";
import { CommentsArea } from "../modal/_components/commentsArea";
import { useModal } from "../../hooks/useModal";
import { EmptyList } from "../emptyList";
import CustomCheckbox from "../ui/customCheckbox";

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
  const { showBooksListModal } = useModal();
  const { scrollableDivRef } = useScrollPosition({
    onThreshold: () => onNextPageScroll?.(),
    scrollDirection: "height",
  });

  const onListClick = (booksListData: BooksListData) =>
    showBooksListModal({
      booksList: booksListData,
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
      className={`flex gap-6 h-fit flex-col ${className ?? ""}
      ${disableScroll ? "" : "overflow-auto"} relative`}
      ref={scrollableDivRef}
    >
      {booksListsData?.length ?? 0 > 0 ? (
        booksListsData?.map((listData) => (
          <div
            className="h-full w-full flex flex-col gap-2 hover:cursor-pointer md:hover:bg-slate-400/40 md:hover:rounded-xl transition-all"
            key={`books-list-${listData.listId}`}
          >
            <div
              className="w-full h-full flex flex-row gap-2"
              onClick={() => onListClick(listData)}
              key={`books-list-${listData.listId}`}
            >
              <BooksListThumbnail
                booksInList={listData?.booksInList}
                alt={`${listData.name} list thumbnail`}
                className="flex-shrink-0"
                thumbnailSize={bookThumbnailSize}
              />
              <div className="flex flex-col w-full flex-shrink">
                <div className="text-lg font-semibold line-clamp-1 leading-7">
                  {listData.name}
                </div>
                <div className="text-sm font-light line-clamp-3 leading-5">
                  {listData.description}
                </div>
                {bottomElementProps && (
                  <div className="w-full flex flex-row justify-end self-end  mt-auto ml-auto gap-6">
                    <div className="flex flex-col gap-1 justify-center items-center">
                      <Add.Fill
                        className="!text-background bg-foreground rounded-full p-1"
                        iconSize="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          bottomElementProps.onAddBookClick(listData);
                        }}
                      />
                      <div className="text-sm text-foreground">Add Book</div>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
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
                  <CustomCheckbox
                    checkedComponent={
                      <Checkmark.Fill
                        iconSize="lg"
                        className="!text-background bg-primary rounded-full p-1"
                      />
                    }
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
        ))
      ) : (
        <EmptyList classNameButton="mt-4" />
      )}
    </div>
  );
};

export default BooksListList;
