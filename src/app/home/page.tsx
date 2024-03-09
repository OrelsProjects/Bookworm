"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/search/searchBar";
import useTable from "../../hooks/useTable";
import BookList from "../../components/book/bookList";

export default function Home(): React.ReactNode {
  const router = useRouter();
  const { userBooks, nextPage } = useTable();

  const onSeeAllClick = useCallback(() => {
    router.push("/my-library");
  }, [router]);

  return (
    <div className="h-full w-full flex flex-col relative justify-top items-start gap-4 p-3">
      <SearchBar />
      <div className="w-full flex flex-row justify-between">
        <div className="text-xl font-bold">Books I've Read</div>
        <div className="text-lg font-bold underline" onClick={onSeeAllClick}>
          See all
        </div>
      </div>
      <div className="w-full">
        <BookList
          books={userBooks.map((ubd) => ubd.bookData.book)}
          onNextPageScroll={nextPage}
          direction="row"
          thumbnailSize="xl"
        />
      </div>
    </div>
  );
}