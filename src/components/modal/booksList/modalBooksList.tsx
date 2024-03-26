import React, { useMemo } from "react";
import { ModalContent } from ".././modalContainers";
import { BooksListData, SafeBooksListData } from "../../../models/booksList";
import BooksListThumbnail from "../../booksList/booksListThumbnail";
import ReadMoreText from "../../readMoreText";
import { ModalBooksListProps } from "./consts";
import Tooltip from "../../ui/tooltip";
import BooksListGridView from "./gridView";
import SwitchEditMode from "../_components/switchEditMode";
import { useModal } from "../../../hooks/useModal";

export const ModalBooksList = <T extends SafeBooksListData>({
  safeBooksListData,
}: ModalBooksListProps<T>) => {
  const { showBooksListEditModal } = useModal();

  const isBooksListDataNotSafe = useMemo(() => {
    return (safeBooksListData as any).userId !== undefined;
  }, [safeBooksListData]);

  const booksListData: BooksListData = useMemo(
    () => safeBooksListData as any as BooksListData,
    [safeBooksListData]
  );

  const ThumbnailDetails = (
    <div className="w-full h-full justify-start items-start">
      <Tooltip
        tooltipContent={
          <div className="text-sm text-muted line-clamp-4 tracking-tighter max-w-xs">
            {safeBooksListData?.name}
          </div>
        }
      >
        <div className="text-start line-clamp-1 text-foreground font-bold text-lg relative tracking-tight">
          {safeBooksListData?.name}
        </div>
      </Tooltip>
      <div className="line-clamp-1 text-muted text-lg">
        {safeBooksListData?.curatorName}
      </div>
    </div>
  );

  return (
    <ModalContent
      thumbnail={
        <BooksListThumbnail
          books={safeBooksListData?.booksInList.map(
            (booksListData) => booksListData.book
          )}
          thumbnailSize="xl"
        />
      }
      thumbnailDetails={ThumbnailDetails}
      buttonsRow={
        <div className="h-fit w-full flex flex-row justify-between">
          <ReadMoreText text={safeBooksListData?.description} maxLines={2} />
          <div className="flex flex-row gap-1 w-fit font-bold text-base">
            {isBooksListDataNotSafe && (
              <SwitchEditMode
                safeBooksListData={safeBooksListData}
                onCheckedChange={(checked) => {
                  if (!checked) return;
                  showBooksListEditModal(booksListData, {
                    popLast: true,
                    shouldAnimate: false,
                  });
                }}
                
              />
            )}
          </div>
        </div>
      }
      bottomSection={
        <BooksListGridView safeBooksListData={safeBooksListData} />
      }
    />
  );
};
