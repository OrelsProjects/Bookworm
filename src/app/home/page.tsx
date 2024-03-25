"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import useTable from "../../hooks/useTable";
import BookList from "../../components/book/bookList";
import useUserRecommendations from "../../hooks/useRecommendations";
import { ReadingStatusEnum } from "../../models/readingStatus";
import SearchBarIcon from "../../components/search/searchBarIcon";
import SearchBar from "../../components/search/searchBar";

export default function Home(): React.ReactNode {
  const router = useRouter();
  const { userBooks, nextPage } = useTable(ReadingStatusEnum.TO_READ);
  const { recommendations } = useUserRecommendations();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchEmpty, setSearchEmpty] = useState(true);

  const onSeeAllClick = useCallback(() => {
    router.push("/my-library");
  }, [router]);

  const Books = () => (
    <div className="flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between items-end">
        <div className="text-2xl font-bold">My next read</div>
        <div className="text-sm text-muted underline" onClick={onSeeAllClick}>
          see all
        </div>
      </div>
      <BookList
        books={userBooks.map((ubd) => ubd.bookData.book)}
        onNextPageScroll={nextPage}
        direction="row"
        thumbnailSize="xl"
      />
    </div>
  );

  const Recommendations = () =>
    recommendations &&
    recommendations.length > 0 && (
      <div className="flex flex-col gap-0">
        <div className="text-2xl font-bold">Recommended for You</div>
        <div className="w-full flex flex-col gap-4">
          {recommendations.length > 0 &&
            recommendations.slice(0, 5).map((recommendation) => (
              <div
                className="flex flex-col gap-0"
                key={`recommendation-${recommendation.publicURL}`}
              >
                <div className="text-lg font-extralight line-clamp-1  tracking-tighter">
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
      </div>
    );

  const Content = () => (
    <div className="h-fit w-full flex flex-col gap-4 pr-1 overflow-auto">
      <Books />
      <Recommendations />
    </div>
  );

  return (
    <div
      className={`h-full w-full flex flex-col relative justify-top items-start gap-4
    ${searchFocused ? "overflow-auto" : ""}
    `}
    >
      <SearchBarIcon>
        <SearchBar
          onEmpty={() => setSearchFocused(false)}
          onChange={(value: string) => {
            if (value) {
              setSearchFocused(true);
            }
          }}
          onBlur={() => {
            if (searchEmpty) {
              setSearchFocused(false);
            }
          }}
        />
      </SearchBarIcon>
      {searchFocused ? <></> : <Content />}
    </div>
  );
}
