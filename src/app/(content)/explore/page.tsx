"use client";

import React from "react";
import GenresTabs from "@/src/components/genresTabs";
import { Skeleton } from "@/src/components/ui/skeleton";
import useExplore from "@/src/hooks/useExplore";
import useScrollPosition from "@/src/hooks/useScrollPosition";
import SearchBar from "@/src/components/search/searchBar";
import RecommendationsList, {
  LoadingRecommendationsList,
} from "@/src/components/booksList/recommendationsList";

interface ExplorePageProps {}

const ExplorePage: React.FC<ExplorePageProps> = () => {
  const {
    nextPage,
    loading,
    loadingGenres,
    loadingNewPage,
    lists,
    genres,
    selectGenre,
  } = useExplore();

  const { scrollableDivRef } = useScrollPosition({
    scrollDirection: "height",
    lowerThreshold: 60,
    upperThreshold: 95,
    onThreshold: nextPage,
    timeBetweenScrollCalls: 50,
  });

  const LoadingGenresTabs = () => (
    <div className="w-full flex flex-row gap-[9px] my-8 justify-between overflow-auto">
      <Skeleton className="w-20 h-6 rounded-full flex-shrink-0" />
      <Skeleton className="w-20 h-6 rounded-full flex-shrink-0" />
      <Skeleton className="w-20 h-6 rounded-full flex-shrink-0" />
      <Skeleton className="w-20 h-6 rounded-full flex-shrink-0" />
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col relative">
      <SearchBar />
      {loadingGenres ? (
        <div className="w-full flex flex-col justify-start mt-[44px] ">
          {loadingGenres && <LoadingGenresTabs />}
          <div className="flex flex-col gap-[22px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingRecommendationsList key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col gap-8 overflow-auto"
          ref={scrollableDivRef}
        >
          <div className="w-full flex flex-row gap-[9px] justify-start mt-[88px]">
            <GenresTabs
              genres={genres}
              take={10}
              selectable
              onSelected={selectGenre}
            />
          </div>
          {loading ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <LoadingRecommendationsList key={i} />
              ))}
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <RecommendationsList lists={lists} showIndex />
              {loadingNewPage && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <LoadingRecommendationsList key={i} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
