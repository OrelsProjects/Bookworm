"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import useTable from "../../hooks/useTable";
import BookList from "../../components/book/bookList";
import useUserRecommendations from "../../hooks/useRecommendations";
import { ReadingStatusEnum } from "../../models/readingStatus";
import SearchBarIcon from "../../components/search/searchBarIcon";
import SearchBar from "../../components/search/searchBar";
import Loading from "../../components/ui/loading";
import Tooltip from "../../components/ui/tooltip";

export default function Home(): React.ReactNode {
  const router = useRouter();
  const { userBooks, nextPage } = useTable(ReadingStatusEnum.TO_READ);
  const { recommendations: recommendationsLists, loading } = useUserRecommendations();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchEmpty, setSearchEmpty] = useState(true);

  const onSeeAllClick = useCallback(() => {
    router.push("/my-library");
  }, [router]);

  const Books = () =>
    userBooks &&
    userBooks.length > 0 && (
      <div className="flex flex-col gap-5">
        <div className="w-full flex flex-row justify-between items-end">
          <div className="text-list-title">
            My next read
          </div>
          <div className="text-see-all" onClick={onSeeAllClick}>
            See all
          </div>
        </div>
        <BookList
          books={userBooks.map((ubd) => ubd.bookData.book)}
          onNextPageScroll={nextPage}
          direction="row"
          thumbnailSize="3xl"
        />
      </div>
    );

  const Recommendations = () =>
    recommendationsLists && recommendationsLists.length > 0 ? (
      <div className="flex flex-col gap-2">
        <div className="w-full flex flex-col gap-4">
          {recommendationsLists.length > 0 &&
            recommendationsLists.slice(0, 5).map((recommendationList) => (
              <div
                className="flex flex-col gap-2"
                key={`recommendation-${recommendationList.publicURL}`}
              >
                <Tooltip
                  tooltipContent={
                    <div className="text-sm text-foreground line-clamp-4 tracking-tighter max-w-xs">
                      {recommendationList.name}
                    </div>
                  }
                >
                  <div className="text-list-title">
                    {recommendationList.name}
                  </div>
                </Tooltip>
                <BookList
                  books={
                    recommendationList.booksInList.map(
                      (bookInList) => bookInList.book
                    ) ?? []
                  }
                  onNextPageScroll={nextPage}
                  direction="row"
                  thumbnailSize="3xl"
                />
              </div>
            ))}
        </div>
      </div>
    ) : (
      loading && (
        <div className="h-full w-full flex justify-center items-center absolute">
          <Loading
            spinnerClassName="w-20 h-20"
            text="Looking for some recommendations..🤖"
          />
        </div>
      )
    );

  const Content = () => (
    <div className="h-fit w-full flex flex-col gap-10 pr-1 overflow-auto">
      <Books />
      <Recommendations />
    </div>
  );

  return (
    <div
      className={`h-full w-full flex flex-col relative justify-top items-start gap-10
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
