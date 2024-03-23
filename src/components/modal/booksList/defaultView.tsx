import React from "react";
import BookButtons from "../../book/bookButtons";
import BookThumbnail from "../../book/bookThumbnail";
import { BurgerLines } from "../../icons/burgerLines";
import { BooksListViewProps } from "./consts";
import { useModal } from "../../../hooks/useModal";

export default function BooksListDefaultView({
  booksListData,
  booksInUsersListsCount = 0,
}: BooksListViewProps) {
  const { Buttons } = BookButtons();
  const { showBookDetailsModal } = useModal();
  return (
    <div className="h-full w-full flex flex-col gap-6 mt-8 pb-2 overflow-auto scrollbar-hide">
      <div className="w-full flex flex-row justify-between">
        <div className="w-fit flex flex-row gap-2">
          <BurgerLines.Fill iconSize="md" className="!text-foreground" />
          <div className="font-bold text-2xl">
            Book List{" "}
            {booksListData?.booksInList && booksListData.booksInList.length > 0
              ? `(${booksListData.booksInList.length})`
              : ""}
          </div>
        </div>
        <div className="w-fit font-bold text-2xl">
          {booksInUsersListsCount}/{booksListData?.booksInList.length}
        </div>
      </div>
      {booksListData?.booksInList.map((bookInList, index) => (
        <div
          key={`book-in-list-${index}`}
          className="flex flex-row justify-start items-start gap-2"
          onClick={(e) => {
            e.stopPropagation();
            showBookDetailsModal({
              book: bookInList.book,
              bookInList,
            });
          }}
        >
          <BookThumbnail book={bookInList.book} thumbnailSize="md" />
          <div className="flex flex-col gap-1">
            <div className="font-semibold line-clamp-2">
              {bookInList.book.title}
            </div>
            <div className="font-thin line-clamp-3">{bookInList.comments}</div>
          </div>
          <div className="h-full w-fit flex-shrink-0 ml-auto" id="buttons">
            <div className="w-full h-full flex flex-col justify-evenly">
              <Buttons
                book={bookInList.book}
                iconSize="sm"
                className="h-full !flex-col !gap-0"
                classNameIcon="!gap-1"
                showAddToListButton={false}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
