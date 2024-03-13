"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/search/searchBar";
import useTable from "../../hooks/useTable";
import BookList from "../../components/book/bookList";
import useUserRecommendations from "../../hooks/useRecommendations";

export default function Home(): React.ReactNode {
  const router = useRouter();
  const { userBooks, nextPage } = useTable();
  const { recommendations } = useUserRecommendations();
  const [searchFocused, setSearchFocused] = useState(false);

  const onSeeAllClick = useCallback(() => {
    router.push("/my-library");
  }, [router]);

  const Books = () => (
    <>
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
        thumbnailSize="xl"
      />
    </>
  );

  const Recommendations = () =>
    recommendations &&
    recommendations.length > 0 && (
      <>
        <div className="text-xl font-bold">Recommended for You</div>
        <div className="w-full">
          <BookList
            books={
              recommendations[0].booksInList.map(
                (bookInList) => bookInList.book
              ) ?? []
            }
            onNextPageScroll={nextPage}
            direction="row"
            thumbnailSize="xl"
          />
        </div>
      </>
    );

  const Content = () => (
    <div className="h-full w-full flex flex-col gap-4">
      <Books />
      <Recommendations />
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col relative justify-top items-start gap-4 p-3 overflow-auto scrollbar-hide">
      <SearchBar
        onEmpty={() => setSearchFocused(false)}
        onFocus={() => setSearchFocused(true)}
        className="h-fit flex-shrink-0"
      />
      {searchFocused ? <></> : <Content />}
    </div>
  );
}
