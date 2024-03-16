import React, { useEffect, useMemo } from "react";
import { ModalContent } from "./modalContainers";
import { SafeBooksListData } from "../../models/booksList";
import BooksListThumbnail from "../booksList/booksListThumbnail";
import { BurgerLines } from "../icons/burgerLines";
import useBooksList from "../../hooks/useBooksList";
import BookThumbnail from "../book/bookThumbnail";
import useBook from "../../hooks/useBook";
import BookButtons from "../book/bookButtons";
import { showModal, ModalTypes } from "../../lib/features/modal/modalSlice";
import { useDispatch } from "react-redux";

interface ModalBooksListProps<T extends SafeBooksListData> {
  booksListData?: T;
}

export const ModalBooksList = <T extends SafeBooksListData>({
  booksListData,
}: ModalBooksListProps<T>) => {
  const dispatch = useDispatch();
  const { userBooksData } = useBook();
  const { booksLists } = useBooksList();

  useEffect(() => {
    if (!booksListData) return;
    const url = decodeURIComponent(booksListData.publicURL ?? "");
    window.history.pushState(null, "", url);
    return () => {
      window.history.pushState(null, "", "/lists");
    };
  }, [booksListData]);

  const booksInUsersListsCount: number = useMemo(() => {
    let booksInUsersLists = 0;
    if (booksListData) {
      const currentList = booksLists.find(
        (list) => list.name === booksListData.name
      );
      currentList?.booksInList.forEach((bookInList) => {
        if (bookInList.book) {
          const userHasBook = userBooksData.some(
            (userBookData) =>
              userBookData.bookData.book?.bookId === bookInList.book.bookId
          );
          if (userHasBook) {
            booksInUsersLists++;
          }
        }
      });
    }
    return booksInUsersLists;
  }, [booksListData, booksLists]);

  return (
    <ModalContent
      thumbnail={
        <BooksListThumbnail
          books={booksListData?.booksInList.map(
            (booksListData) => booksListData.book
          )}
          thumbnailSize="lg"
        />
      }
      thumbnailDetails={
        <div className="w-full h-full justify-start items-start">
          <div className="line-clamp-1 text-foreground font-bold text-xl">
            {booksListData?.name}
          </div>
          <div className="line-clamp-3 text-muted text-lg">
            {booksListData?.description}
          </div>
        </div>
      }
      bottomSection={
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
          {booksListData?.booksInList.map((listData, index) => (
            <div
              key={`book-in-list-${index}`}
              className="flex flex-row justify-start items-start gap-2"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  showModal({
                    type: ModalTypes.BOOK_DETAILS,
                    data: listData.book,
                  })
                );
              }}
            >
              <BookThumbnail book={listData.book} thumbnailSize="md" />
              <div className="flex flex-col gap-1">
                <div className="font-semibold line-clamp-2">
                  {listData.book.title}
                </div>
                <div className="font-thin line-clamp-3">
                  {listData.comments}
                </div>
              </div>
              <div className="h-full w-fit flex-shrink-0 ml-auto" id="buttons">
                <div className="w-full h-full flex flex-col justify-evenly">
                  <BookButtons
                    book={listData.book}
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
      }
    />
  );
};
