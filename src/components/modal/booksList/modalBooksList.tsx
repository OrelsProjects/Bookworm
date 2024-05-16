import React from "react";
import { ModalContent } from ".././modalContainers";
import { SafeBooksListData } from "../../../models/booksList";
import BooksListThumbnail from "../../booksList/booksListThumbnail";
import ReadMoreText from "../../readMoreText";
import { ModalBooksListProps } from "./consts";
import Tooltip from "../../ui/tooltip";
import BooksListGridView, { BooksListGridViewLoading } from "./gridView";
import { Skeleton } from "../../ui/skeleton";
import { getThumbnailSize } from "../../../consts/thumbnail";
import Tag from "../../ui/Tag";
import { unslugifyText } from "../../../utils/textUtils";

export const ModalBooksList = <T extends SafeBooksListData>({
  safeBooksListData,
  loading,
  className,
}: ModalBooksListProps<T>) => {
  const ThumbnailDetails = () => (
    <div className="w-full h-full justify-start items-start">
      <Tooltip
        tooltipContent={
          <div className="text-sm text-muted line-clamp-4 tracking-tighter max-w-xs">
            {safeBooksListData?.name}
          </div>
        }
      >
        <div className="text-start line-clamp-1 text-foreground font-bold text-xl relative">
          {safeBooksListData?.name}
        </div>
      </Tooltip>
      <div className="line-clamp-1 text-muted text-lg">
        {safeBooksListData?.curatorName}
      </div>
      {(safeBooksListData?.visitCount || 0) > 0 && (
        <Tag>{safeBooksListData?.visitCount} views</Tag>
      )}
    </div>
  );

  return (
    <ModalContent
      thumbnail={
        loading ? (
          <Skeleton
            className={`${getThumbnailSize("xl").className} rounded-2xl`}
            type="shimmer"
          />
        ) : (
          <BooksListThumbnail
            booksInList={safeBooksListData?.booksInList}
            thumbnailSize="xl"
          />
        )
      }
      thumbnailDetails={
        loading ? (
          <div className="w-full flex flex-col gap-2 mt-1">
            <Skeleton className="w-5/6 h-4 rounded-lg" type="shimmer" />
            <Skeleton className="w-4/6 h-3 rounded-lg" type="shimmer" />
          </div>
        ) : (
          <ThumbnailDetails />
        )
      }
      buttonsRow={
        loading ? (
          <div className="w-full flex flex-col gap-2 mt-1 mb-5">
            <Skeleton className="w-3/4 h-4 rounded-lg" type="shimmer" />
            <Skeleton className="w-4/6 h-4 rounded-lg" type="shimmer" />
          </div>
        ) : (
          <div className="h-fit w-full flex flex-col justify-between gap-[15px]">
            <ReadMoreText
              className="text-lg font-light leading-[30px]"
              text={safeBooksListData?.description}
              maxLines={2}
            />
          </div>
        )
      }
      bottomSection={
        <div className="w-full flex flex-col gap-[15px]">
          {loading ? (
            <>
              <div className="w-full flex flex-col gap-2 mt-1 mb-5">
                <Skeleton className="w-3/4 h-4 rounded-lg" type="shimmer" />
                <Skeleton className="w-4/6 h-4 rounded-lg" type="shimmer" />
              </div>
              <BooksListGridViewLoading />
            </>
          ) : (
            <>
              <div className="w-full flex flex-row gap-3 justify-between items-center overflow-auto mb-[15px]">
                {safeBooksListData?.genres?.slice(0, 3)?.map((genre) => (
                  <Tag className="font-bold h-8 text-base">
                    <div className="px-2 truncate">{unslugifyText(genre)}</div>
                  </Tag>
                ))}
              </div>
              <BooksListGridView
                safeBooksListData={safeBooksListData}
                curator={safeBooksListData?.curatorName}
              />
            </>
          )}
        </div>
      }
    />
  );
};
