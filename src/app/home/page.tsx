"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/search/searchBar";
import useTable from "../../hooks/useTable";
import BookList from "../../components/book/bookList";
import useUserRecommendations from "../../hooks/useRecommendations";
import { ReadingStatusEnum } from "../../models/readingStatus";

export default function Home(): React.ReactNode {
  const router = useRouter();
  const { userBooks, nextPage } = useTable(ReadingStatusEnum.TO_READ);
  const { recommendations } = useUserRecommendations();
  const [searchFocused, setSearchFocused] = useState(false);

  const onSeeAllClick = useCallback(() => {
    router.push("/my-library");
  }, [router]);

  const Books = () => (
    <>
      <div className="w-full flex flex-row justify-between">
        <div className="text-xl font-bold">My next read</div>
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
        <div className="w-full flex flex-col gap-4">
          {recommendations.length > 0 &&
            recommendations.slice(0, 5).map((recommendation) => (
              <div
                className="flex flex-col gap-1"
                key={`recommendation-${recommendation.publicURL}`}
              >
                <div className="text-lg font-extralight line-clamp-1">
                  {recommendation.name}
                </div>
                <BookList
                  books={
                    recommendation.booksInList.map(
                      (bookInList) => bookInList.book
                    ) ?? []
                  }
                  onNextPageScroll={nextPage}
                  direction="row"
                  thumbnailSize="xl"
                />
              </div>
            ))}
        </div>
      </>
    );

  const Content = () => (
    <div className="h-fit w-full flex flex-col gap-4">
      <Books />
      <Recommendations />
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col relative justify-top items-start gap-4 overflow-auto">
      <SearchBar
        onEmpty={() => setSearchFocused(false)}
        onFocus={() => setSearchFocused(true)}
        className="h-fit flex-shrink-0"
      />
      {searchFocused ? <></> : <Content />}
    </div>
  );
}
