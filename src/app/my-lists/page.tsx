"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { SearchBarComponent } from "../../components/search/searchBarComponent";
import useTable from "../../hooks/useTable";
import BookList from "../../components/book/bookList";
import BooksListList from "../../components/booksList/booksListList";
import { Plus } from "../../components/icons";
import { useDispatch, useSelector } from "react-redux";
import { showModal, ModalTypes } from "../../lib/features/modal/modalSlice";
import { selectBooksLists } from "../../lib/features/booksLists/booksListsSlice";
import Modal from "../../components/modal/modal";
import { SearchBar } from "../../components";

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

  const UserBooksLists = () => (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between">
        <div className="text-xl font-bold">My lists</div>
        <div>
          <Plus.Fill
            className="w-6 h-6 !text-foreground"
            onClick={onAddListClick}
          />
        </div>
      </div>
      <BooksListList
        direction="column"
        disableScroll
        booksListsData={booksListsData}
      />
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
