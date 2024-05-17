"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BookList from "../../../components/book/bookList";
import useRecommendations from "../../../hooks/useRecommendations";
import ReadingStatus, {
  ReadStatus,
  ReadingStatusEnum,
} from "../../../models/readingStatus";
import SearchBar from "../../../components/search/searchBar";
import Loading from "../../../components/ui/loading";
import BooksListThumbnail from "../../../components/booksList/booksListThumbnail";
import Tag from "../../../components/ui/Tag";
import { cn } from "../../../lib/utils";
import { getThumbnailSize } from "../../../consts/thumbnail";
import { useModal } from "../../../hooks/useModal";
import { SeeAll } from "../../../components/ui/seeAll";
import useNavigation from "../../../lib/navigation";
import { useAppSelector } from "../../../lib/hooks";

export default function Home(): React.ReactNode {
  const router = useRouter();
  const { showBooksListModal } = useModal();
  const { allRecommendations, loading } = useRecommendations();
  const { userBooksData } = useAppSelector((state) => state.userBooks);

  const hasBooksRead = useMemo(() => {
    return userBooksData.some(
      ({ userBook }) => userBook.readingStatusId === ReadingStatusEnum.READ
    );
  }, [userBooksData]);

  const hasBooksToRead = useMemo(() => {
    return userBooksData.some(
      ({ userBook }) => userBook.readingStatusId === ReadingStatusEnum.TO_READ
    );
  }, [userBooksData]);

  const [searchFocused, setSearchFocused] = useState(false);

  const onSeeAllClick = useCallback(
    (readStatus: ReadStatus) => {
      router.push(`/my-library/${readStatus}`);
    },
    [router]
  );

  const Books = ({
    title,
    readStatus,
  }: {
    title: string;
    readStatus: ReadStatus;
  }) => (
    <div className="flex flex-col gap-3.5">
      <SeeAll title={title} onClick={() => onSeeAllClick(readStatus)} />
      <BookList
        readStatus={readStatus}
        direction="row"
        thumbnailSize="2xl"
        showDelete
      />
    </div>
  );

  const RecommendationsList = () => {
    const router = useRouter();

    return allRecommendations && allRecommendations.length > 0 ? (
      <div className="flex flex-col gap-2">
        <div className="w-full flex flex-col gap-3.5">
          <SeeAll
            title="Recommended for you"
            onClick={() => router.push("/see-all/recommended")}
          />
          <div className="flex flex-row gap-[15px] md:gap-5 overflow-x-auto">
            {allRecommendations.length > 0 &&
              allRecommendations
                .slice()
                .sort((a, b) => (b.matchRate || 0) - (a.matchRate || 0))
                .map((recommendationList) => {
                  const match = parseInt(`${recommendationList.matchRate}`, 10);
                  return (
                    <div
                      className="flex flex-row gap-4 cursor-pointer transition-all p-2.5 hover:bg-slate-400/40 rounded-xl"
                      key={`recommendation-${recommendationList.publicURL}`}
                      onClick={() => {
                        showBooksListModal({
                          booksList: recommendationList,
                        });
                      }}
                    >
                      <div
                        className={cn(
                          "flex flex-col gap-2.5",
                          getThumbnailSize("2xl").width
                        )}
                      >
                        <BooksListThumbnail
                          thumbnailSize="2xl"
                          booksInList={recommendationList.booksInList}
                          className="relative"
                        >
                          <div className="w-full flex justify-center items-center h-8 px-[9px] absolute bottom-[5px] z-30">
                            {!isNaN(match) && (
                              <Tag className="h-8 w-full">
                                {recommendationList.matchRate && match}% Match
                              </Tag>
                            )}
                          </div>
                        </BooksListThumbnail>
                        <div className="w-full flex gap-2 flex-col">
                          <span className="font-bold leading-[16px] md:text-xl line-clamp-1 md:line-clamp-2">
                            {recommendationList.name}
                          </span>
                          <span className="text-primary text-sm leading-4 truncate md:text-lg">
                            {recommendationList.curatorName}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
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
  };

  const Content = () => (
    <div className="h-fit w-full flex flex-col gap-[35px] md:gap-[45px] mt-[48px] overflow-auto">
      {hasBooksToRead && <Books title="Next read" readStatus="to-read" />}
      <RecommendationsList />
      {hasBooksRead && <Books title="Books I've read" readStatus="read" />}
    </div>
  );

  return (
    <div
      className={`h-full w-full flex flex-col relative justify-top items-start gap-10`}
    >
      <SearchBar
        onEmpty={() => setSearchFocused(false)}
        onChange={(value: string) => {
          if (value) {
            setSearchFocused(true);
          }
        }}
        booksFirst
      />
      {searchFocused ? <></> : <Content />}
    </div>
  );
}
