"use client";

import React from "react";
import BooksListThumbnail from "../../components/booksList/booksListThumbnail";
import GenresTabs from "../../components/genresTabs";
import { Skeleton } from "../../components/ui/skeleton";
import useExplore from "../../hooks/useExplore";
import { useModal } from "../../hooks/useModal";
import { SafeBooksListData } from "../../models/booksList";
import useScrollPosition from "../../hooks/useScrollPosition";
import useSearch from "../../hooks/useSearch";
import { FaEye as Eye } from "react-icons/fa";
import Tag from "../../components/ui/Tag";
import SearchBar from "../../components/search/searchBar";

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

  const ListTitleAndCurator = ({ list }: { list: SafeBooksListData }) => (
    <div className="flex flex-col gap-2 truncate" id="title-subtitle">
      <div className="text-foreground font-semibold text-base leading-4 tracking-[0.15px] truncate">
        {list.name}
      </div>
      <div className="text-primary font-normal text-sm leading-[14px] tracking-[0.15px] truncate">
        {list.curatorName}
      </div>
    </div>
  );

  const ListDescription = ({ description }: { description: string }) => (
    <div
      className="text-foreground font-light text-sm h-9 max-h-9 leading-[21px] tracking-[0.15px] line-clamp-2"
      id="curator-comment"
    >
      {description}
    </div>
  );

  const ListTags = ({ list }: { list: SafeBooksListData }) => (
    <div className="flex flex-row gap-2.5 font-bold">
      {list.matchRate && <Tag>{parseInt(`${list.matchRate}`, 10)}% Match</Tag>}
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
  );

  const List = (list: SafeBooksListData, index: number) => (
    <div
      className="w-full flex flex-row gap-2.5 justify-start items-start py-1"
      onClick={() => showBooksListModal({ bookList: list })}
    >
      <BooksListThumbnail
        thumbnailSize="md"
        booksInList={list.booksInList}
        className="relative"
        Icon={
          <div className="absolute bottom-0 left-0 h-[27px] w-[29px] rounded-r-lg bg-background font-bold text-xs flex justify-center items-center">
            #{index + 1}
          </div>
        }
      />
      <div className="w-full flex flex-col gap-2.5 line-clamp-2">
        <ListTitleAndCurator list={list} />
        <ListDescription description={list.description || ""} />
        <ListTags list={list} />
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col relative">
      <SearchBar />
      {loadingGenres ? (
        <div className="w-full flex flex-col justify-start  mt-[88px] ">
          {loadingGenres && <LoadingGenresTabs />}
          <div className="flex flex-col gap-[22px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingList key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col gap-8 overflow-auto  mt-[88px]"
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
