import React, { useMemo } from "react";
import BookThumbnail from "../../book/bookThumbnail";
import { BurgerLines } from "../../icons/burgerLines";
import { BooksListViewProps } from "./consts";
import { useModal } from "../../../hooks/useModal";
import { Bookmark } from "../../icons/bookmark";
import { Icon } from "../../icons/iconContainer";
import { Checkmark } from "../../icons/checkmark";
import { getThumbnailSize } from "../../../consts/thumbnail";
import BookButtons from "../../book/bookButtons";

const BookIcon = (icon: React.ReactNode, className?: string) => (
  <div className={`rounded-full bg-background p-2 ${className}`}>{icon}</div>
);

export default function BooksListGridView({
  booksListData,
  booksInUsersListsCount = 0,
}: BooksListViewProps) {
  const { showBookDetailsModal } = useModal();

  const isOddNumberOfBooks = useMemo(
    () => (booksListData?.booksInList?.length ?? 0) % 2 === 1,
    [booksListData?.booksInList.length]
  );

  const lastIndexOfBooksInList = useMemo(
    () => (booksListData?.booksInList?.length ?? 1) - 1,
    [booksListData?.booksInList.length]
  );

  return (
    <div className="h-full w-full flex flex-col gap-6 mt-8 pb-2 overflow-auto scrollbar-hide">
      <div className="w-full flex flex-row justify-between">
        <div className="w-fit flex flex-row gap-2">
          <BurgerLines.Fill iconSize="md" className="!text-foreground" />
          <div className="font-bold text-2xl">Book List</div>
        </div>
        <div className="w-fit font-bold text-2xl">
          {booksInUsersListsCount}/{booksListData?.booksInList.length}
        </div>
      </div>
      <div className={`flex flex-wrap justify-around gap-4`}>
        {booksListData?.booksInList.map((bookInList, index) => (
          <div
            key={`book-in-list-${index}`}
            className={`flex flex-col justify-start items-center gap-2 ${
              getThumbnailSize("xl").width
            }
            ${
              isOddNumberOfBooks &&
              index === lastIndexOfBooksInList &&
              "mr-auto"
            }
            `}
            onClick={(e) => {
              e.stopPropagation();
              showBookDetailsModal({
                book: bookInList.book,
                bookInList,
              });
            }}
          >
            <BookThumbnail book={bookInList.book} thumbnailSize="xl">
              <div className="w-full h-full z-40 absolute top-0">
                <div className="w-full h-full flex flex-row items-end justify-center gap-6 p-2">
                  <BookButtons
                    book={bookInList.book}
                    iconSize="sm"
                    variation="black"
                    showAddToListButton={false}
                  />
                  {/* {BookIcon(
                    <Bookmark.Outline iconSize="xs" onClick={() => {}} />
                  )}
                  {BookIcon(
                    <Checkmark.Outline
                      iconSize="sm"
                      // className="!text-background background-foreground"
                    />,
                    "p-1"
                  )} */}
                </div>
              </div>
            </BookThumbnail>
            <div className="w-full">
              <div className="w-full text-lg leading-7 font-bold truncate">
                {bookInList.book.title}
              </div>
              <div className="w-full text-sm text-primary leading-5 truncate">
                {bookInList.book.authors?.join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
