"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { SearchBarComponent } from "../../components/search/searchBarComponent";
import useTable from "../../hooks/useTable";
import BookList from "../../components/book/bookList";
import ReadList from "../../components/readList/readList";
import { Plus } from "../../components/icons";

const MyLists = () => {
  const router = useRouter();
  const { userBooks, nextPage, searchBooks } = useTable();

  const onSeeAllClick = useCallback(() => {
    router.push("/my-library");
  }, [router]);

  const UserBooks = () => (
    <div className="w-full h-full flex flex-col gap-2">
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
        <Plus.Fill className="w-6 h-6 !text-foreground" />
      </div>
      <div className="w-full">
        <ReadList direction="column" />
      </div>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col relative justify-top items-start gap-4 p-3">
      <SearchBarComponent
        onChange={(value: string) => searchBooks(value)}
        onSubmit={(value: string) => searchBooks(value)}
        placeholder="Search in Your Books..."
      />
      <div className="w-full flex flex-col">
        <UserBooks />
        <UserBooksLists />
      </div>
    </div>
  );
};

export default MyLists;
