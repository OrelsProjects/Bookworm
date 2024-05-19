import React from "react";
import { SafeBooksListData } from "../../models/booksList";
import { Skeleton } from "../ui/skeleton";
import { useModal } from "../../hooks/useModal";
import { FaEye as Eye } from "react-icons/fa";
import Tag from "../../components/ui/Tag";
import BooksListThumbnail from "./booksListThumbnail";
import { formatNumber, unslugifyText } from "../../utils/textUtils";
import { cn } from "../../lib/utils";

export const LoadingRecommendationsList = ({
  thumbnailClassName,
}: {
  thumbnailClassName?: string;
}) => {
  return (
    <div className="w-full flex flex-row gap-3 justify-start items-center">
      <BooksListThumbnail
        loading
        thumbnailSize="md"
        className={thumbnailClassName}
      />
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
    <div className="text-primary font-normal text-sm tracking-[0.15px] truncate">
      {list.curatorName}
    </div>
  </div>
);

const ListDescription = ({ description }: { description: string }) => (
  <div
    className="text-foreground font-light text-sm h-10 max-h-10 leading-[21px] tracking-[0.15px] line-clamp-2"
    id="curator-comment"
  >
    {description}
  </div>
);

const ListTags = ({ list }: { list: SafeBooksListData }) => {
  const matchRate = parseInt(`${list.matchRate}`, 10);
  return (
    <div className="flex flex-row gap-2.5 font-bold">
      {list.visitCount !== undefined && list.visitCount > 0 && (
        <Tag className="flex-shrink-0">
          <div className="flex flex-row gap-[3px] justify-center items-center">
            {formatNumber(list.visitCount)} <Eye />
          </div>
        </Tag>
      )}
      {/* TODO: REMOVE THE FIXED NUMBER OF 50% AND COME UP WITH A BETTER SOLUTION IN THE FUTURE */}
      {matchRate && matchRate > 50 && (
        <>
          <Tag className="flex sm:hidden">{matchRate}%</Tag>
          <Tag className="hidden sm:flex">{matchRate}% Match</Tag>
        </>
      )}
      {list.genres && list.genres.length > 0 && (
        <Tag className="flex flex-shrink-0">
          {unslugifyText(list.genres[0])}
        </Tag>
      )}
    </div>
  );
};

const RecommendationsList = ({
  lists,
  showIndex,
  thumbnailClassName,
}: {
  lists: SafeBooksListData[];
  showIndex?: boolean;
  thumbnailClassName?: string;
}) => {
  const { showBooksListModal } = useModal();

  return (
    <div className="flex flex-col gap-3">
      {lists.map((list, index) => (
        <div
          className="w-full flex flex-row gap-2.5 justify-start items-start md:items-center py-1 cursor-pointer transition-all md:p-2.5 hover:bg-slate-400/40 hover:rounded-lg"
          onClick={() => showBooksListModal({ booksList: list })}
          key={`recommendation-list-${list.name}`}
        >
          <BooksListThumbnail
            thumbnailSize={"md"}
            booksInList={list.booksInList}
            className={cn("relative", thumbnailClassName)}
            Icon={
              showIndex && (
                <div className="absolute bottom-0 left-0 h-[27px] w-[29px] rounded-r-lg bg-background font-bold text-xs flex justify-center items-center">
                  #{index + 1}
                </div>
              )
            }
          />
          <div className="w-full flex flex-col gap-2.5 line-clamp-2">
            <ListTitleAndCurator list={list} />
            <ListDescription description={list.description || ""} />
            <ListTags list={list} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendationsList;
