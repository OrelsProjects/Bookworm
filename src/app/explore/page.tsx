"use client";

import React from "react";
import BooksListThumbnail from "../../components/booksList/booksListThumbnail";
import GenresTabs from "../../components/genresTabs";
import { SearchBarComponent } from "../../components/search/searchBarComponent";
import SearchBarIcon from "../../components/search/searchBarIcon";
import { Skeleton } from "../../components/ui/skeleton";
import useExplore from "../../hooks/useExplore";
import { useModal } from "../../hooks/useModal";
import { SafeBooksListData } from "../../models/booksList";
import useScrollPosition from "../../hooks/useScrollPosition";
import useSearch from "../../hooks/useSearch";
import { FaEye as Eye } from "react-icons/fa";
import { cn } from "../../lib/utils";

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
  const {
    search,
    loading: searchLoading,
    results: searchResults,
    nextPage: searchNextPage,
  } = useSearch();

  const { showBooksListModal } = useModal();
  const { scrollableDivRef } = useScrollPosition({
    scrollDirection: "height",
    lowerThreshold: 60,
    upperThreshold: 95,
    onThreshold: nextPage,
    timeBetweenScrollCalls: 50,
  });

  const LoadingGenresTabs = () => (
    <div className="w-full flex flex-row gap-[9px] my-8 justify-start overflow-auto">
      <Skeleton className="w-20 h-6 rounded-full flex-shrink-0" />
      <Skeleton className="w-20 h-6 rounded-full flex-shrink-0" />
      <Skeleton className="w-20 h-6 rounded-full flex-shrink-0" />
      <Skeleton className="w-20 h-6 rounded-full flex-shrink-0" />
    </div>
  );

  const LoadingList = () => {
    return (
      <div className="w-full flex flex-row gap-3 justify-start items-center">
        <BooksListThumbnail loading thumbnailSize="md" />
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1" id="loading-title-subtitle">
            <Skeleton className="w-48 h-3 rounded-xl" />
            <Skeleton className="w-24 h-3 rounded-xl" />
          </div>
          <div className="flex flex-col gap-1" id="loading-curator-comment">
            <Skeleton className="w-40 h-3 rounded-xl" />
            <Skeleton className="w-36 h-3 rounded-xl" />
          </div>
          <div className="flex flex-row gap-1.5">
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
        </div>
      </div>
    );
  };

  const Tag = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={cn(
        "w-fit h-6 text-sm sm:text-xs tracking-[0.15px] p-2 flex justify-center items-center rounded-full border-2 border-foreground bg-background",
        className
      )}
    >
      {children}
    </div>
  );

  const List = (list: SafeBooksListData) => (
    <div
      className="w-full flex flex-row gap-3 justify-start items-start py-1"
      onClick={() => showBooksListModal({ bookList: list })}
    >
      <BooksListThumbnail thumbnailSize="md" booksInList={list.booksInList} />
      <div className="w-full flex flex-col gap-3 line-clamp-2">
        <div className="flex flex-col truncate" id="title-subtitle">
          <div className="text-foreground font-semibold text-base leading-4 tracking-[0.15px] truncate">
            {list.name}
          </div>
          <div className="text-primary font-normal text-sm leading-[14px] tracking-[0.15px] truncate">
            {list.curatorName}
          </div>
        </div>
        <div
          className="text-foreground font-light text-sm leading-[21px] tracking-[0.15px] line-clamp-2"
          id="curator-comment"
        >
          {list.description}
        </div>
        <div className="w-full flex flex-row gap-[5px] overflow-auto">
          {list.matchRate && (
            <Tag>{parseInt(`${list.matchRate}`, 10)}% Match</Tag>
          )}
          {list.visitCount !== undefined && list.visitCount > 0 && (
            <Tag>
              <div className="flex flex-row gap-[3px] justify-center items-center">
                {list.visitCount} <Eye />
              </div>
            </Tag>
          )}
          {list.genres && list.genres.length > 0 && (
            <Tag className="hidden sm:flex">{list.genres[0]}</Tag>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
      <SearchBarIcon>
        <SearchBarComponent
          onChange={(value: string) => search(value)}
          onSubmit={(value: string) => search(value)}
          placeholder="Search Readlists..."
          className="pr-16"
        />
      </SearchBarIcon>
      {loadingGenres ? (
        <div className="w-full flex flex-col justify-start">
          {loadingGenres && <LoadingGenresTabs />}
          <div className="flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingList key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col mt-8 gap-8 overflow-auto"
          ref={scrollableDivRef}
        >
          <div className="w-full flex flex-row gap-[9px] justify-start">
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
                <LoadingList key={i} />
              ))}
            </>
          ) : (
            <div className="flex flex-col gap-3">
              {lists.map(List)}
              {loadingNewPage && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <LoadingList key={i} />
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