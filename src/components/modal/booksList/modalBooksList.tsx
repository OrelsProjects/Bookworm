import React, { useMemo } from "react";
import { ModalContent } from ".././modalContainers";
import { BooksListData, SafeBooksListData } from "../../../models/booksList";
import BooksListThumbnail from "../../booksList/booksListThumbnail";
import ReadMoreText from "../../readMoreText";
import { ModalBooksListProps } from "./consts";
import Tooltip from "../../ui/tooltip";
import BooksListGridView from "./gridView";
import SwitchEditMode from "../_components/switchEditMode";
import ContentEditBookList from "../_components/contentEditBookList";

export const ModalBooksList = <T extends SafeBooksListData>({
  safeBooksListData,
}: ModalBooksListProps<T>) => {
  const [showEdit, setShowEdit] = React.useState(false);

  const isBooksListDataNotSafe = useMemo(() => {
    return (safeBooksListData as any).userId !== undefined;
  }, [safeBooksListData]);

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
          thumbnailSize="lg"
        />
      }
      thumbnailDetails={ThumbnailDetails}
      buttonsRow={
        <div className="h-fit w-full flex flex-row justify-between">
          {!showEdit && (
            <ReadMoreText text={safeBooksListData?.description} maxLines={2} />
          )}
          <div className="flex flex-row gap-1 w-fit font-bold text-base">
            {/* {isBooksListDataNotSafe && (
              <SwitchEditMode
                safeBooksListData={safeBooksListData}
                onCheckedChange={(checked) => setShowEdit(checked)}
              />
            )} */}
          </div>
        </div>
      }
      bottomSection={
        // showEdit && isBooksListDataNotSafe ? (
        //   ContentEditBookList({
        //     bookslistData: safeBooksListData as BooksListData,
        //   })
        // ) : (
        <BooksListGridView safeBooksListData={safeBooksListData} />
        // )
      }
    />
  );
};
