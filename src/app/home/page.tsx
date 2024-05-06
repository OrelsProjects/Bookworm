"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import useTable from "../../hooks/useTable";
import BookList from "../../components/book/bookList";
import useUserRecommendations from "../../hooks/useRecommendations";
import { ReadingStatusEnum } from "../../models/readingStatus";
import SearchBar from "../../components/search/searchBar";
import Loading from "../../components/ui/loading";
import BooksListThumbnail from "../../components/booksList/booksListThumbnail";
import Tag from "../../components/ui/Tag";
import { cn } from "../../lib/utils";
import { getThumbnailSize } from "../../consts/thumbnail";
import { UserBookData } from "../../models";
import { useModal } from "../../hooks/useModal";
import { SeeAll } from "../../components/ui/seeAll";

export default function Home(): React.ReactNode {
  const router = useRouter();
  const { showBooksListModal } = useModal();
  const { toReadBooks, readBooks, nextPage } = useTable(
    ReadingStatusEnum.TO_READ
  );
  const { recommendations: recommendationsLists, loading } =
    useUserRecommendations();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchEmpty, setSearchEmpty] = useState(true);

  const onSeeAllClick = useCallback(() => {
    router.push("/my-library");
  }, [router]);

  const Books = ({
    books,
    title,
  }: {
    books: UserBookData[];
    title: string;
  }) => (
    <div className="flex flex-col gap-3.5">
      <SeeAll title={title} onClick={onSeeAllClick} />
      <BookList
        books={books.map((ubd) => ubd.bookData.book)}
        onNextPageScroll={nextPage}
        direction="row"
        thumbnailSize="3xl"
        showDelete
      />
    </div>
  );

  const Recommendations = () => {
    const router = useRouter();

    return recommendationsLists && recommendationsLists.length > 0 ? (
      <div className="flex flex-col gap-2">
        <div className="w-full flex flex-col gap-3.5">
          <SeeAll
            title="Recommended for you"
            onClick={() => router.push("/explore")}
          />
          <div className="flex flex-row gap-3.5 overflow-auto">
            {recommendationsLists.length > 0 &&
              recommendationsLists
                .slice()
                .sort((a, b) => (b.matchRate || 0) - (a.matchRate || 0))
                .map((recommendationList) => (
                  <div
                    className="flex flex-row gap-4"
                    key={`recommendation-${recommendationList.publicURL}`}
                    onClick={() => {
                      showBooksListModal({ bookList: recommendationList });
                    }}
                  >
                    <div
                      className={cn(
                        "flex flex-col gap-2.5",
                        getThumbnailSize("3xl").width
                      )}
                    >
                      <BooksListThumbnail
                        thumbnailSize="3xl"
                        booksInList={recommendationList.booksInList}
                        className="relative"
                      >
                        <div className="w-full flex justify-center items-center h-8 px-[9px] absolute bottom-[5px] z-30">
                          <Tag className="h-8 w-full">
                            {recommendationList.matchRate &&
                              parseInt(`${recommendationList.matchRate}`, 10)}
                            % Match
                          </Tag>
                        </div>
                      </BooksListThumbnail>
                      <div className="w-full flex gap-2 flex-col">
                        <span className="font-bold leading-[16px] truncate">
                          {recommendationList.name}
                        </span>
                        <span className="text-primary text-sm leading-4 truncate">
                          {recommendationList.curatorName}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
    <div className="h-fit w-full flex flex-col gap-[35px] mt-[48px] overflow-auto">
      <Books books={toReadBooks} title="Next read" />
      <Recommendations />
      <Books books={readBooks} title="Books I've read" />
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
        onBlur={() => {
          if (searchEmpty) {
            setSearchFocused(false);
          }
        }}
        booksFirst
      />
      {searchFocused ? <></> : <Content />}
    </div>
  );
}
