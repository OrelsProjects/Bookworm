"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { SearchBarComponent } from "../../components/search/searchBarComponent";
import useTable from "../../hooks/useTable";
import BookList from "../../components/book/bookList";
import BooksListList from "../../components/booksList/booksListList";
import { Add, Plus } from "../../components/icons";
import { useDispatch, useSelector } from "react-redux";
import { showModal, ModalTypes } from "../../lib/features/modal/modalSlice";
import { selectBooksLists } from "../../lib/features/booksLists/booksListsSlice";

const MyLists = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { booksListsData } = useSelector(selectBooksLists);
  const { userBooks, nextPage, searchBooks } = useTable();

  const onSeeAllClick = useCallback(() => {
    router.push("/my-library");
  }, [router]);

  const onAddListClick = () => {
    dispatch(
      showModal({
        type: ModalTypes.BOOKS_LIST_DETAILS,
      })
    );
  };

  const UserBooks = () => (
    <div className="w-full h-fit flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between">
        <div className="text-xl font-bold">Books I've Read</div>
        <div className="text-lg font-bold underline" onClick={onSeeAllClick}>
          See all
        </div>
      </div>
      <BookList
        books={userBooks.map((ubd) => ubd.bookData.book)}
        onNextPageScroll={nextPage}
        direction="row"
      />
    </div>
  );

  const EmptyList = () => (
    <div className="mt-3 w-fit h-fit flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-base font-bold">
          You have no Readlists for now :(
        </div>
        <div className="text-base font-light">
          Ready to create and share your Readlist with friends? Spread the joy
          of reading by inviting them to join in!
        </div>
      </div>

      <div
        className="w-full h-fit flex flex-row gap-2 rounded-full text-background bg-foreground p-2"
        onClick={onAddListClick}
      >
        <Add.Fill className="!text-background" iconSize="sm" />
        Create your first shareable Readlist
      </div>
    </div>
  );

  const UserBooksLists = () => (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between">
        <div className="text-2xl font-bold">My Readlists</div>
        <div>
          <Plus.Fill
            className="!text-foreground"
            iconSize="sm"
            onClick={onAddListClick}
          />
        </div>
      </div>
      {booksListsData.length === 0 ? (
        <EmptyList />
      ) : (
        <BooksListList
          direction="column"
          disableScroll
          booksListsData={booksListsData}
          bottomElementProps={{
            onAddBookClick: (list) => {
              dispatch(
                showModal({
                  type: ModalTypes.BOOKS_LIST_DETAILS,
                  data: list,
                })
              );
            },
            onShareClick: (list) => {
              console.log("share list", list);
            },
          }}
        />
      )}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col gap-4 pb-4 p-3">
      <SearchBarComponent
        onChange={(value: string) => searchBooks(value)}
        onSubmit={(value: string) => searchBooks(value)}
        placeholder="Search in Your Books..."
      />
      <div className="flex gap-3 flex-grow scrollbar-hide overflow-auto flex-col h-96">
        <UserBooks />
        <UserBooksLists />
      </div>
    </div>
  );
};

export default MyLists;
