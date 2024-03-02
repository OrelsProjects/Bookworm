import React from "react";
import { Button } from "../button";

import Loading from "../loading";
import { Book } from "@/src/models";
import { useDispatch } from "react-redux";
import { BottomSheetTypes, showModal } from "@/src/lib/features/modal/modalSlice";

export interface BookButtonProps {
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export const DeleteButton = ({
  loading,
  className,
  onClick,
}: BookButtonProps): React.ReactNode => (
  <Button
    onClick={onClick}
    className={`rounded-full flex justify-center items-center border-none h-11 w-11 p-2 ${className}`}
  >
    {loading ? (
      <Loading spinnerClassName="!fill-primary" />
    ) : (
      <img
        src="/delete.svg"
        alt="Delete"
        className="rounded-full !relative !w-6 !h-6 overflow-visible"
      />
    )}
  </Button>
);

const FavoriteButton = ({
  loading,
  className,
  onClick,
  isFavorite,
}: BookButtonProps & { isFavorite: boolean | undefined }): React.ReactNode => (
  <Button
    onClick={onClick}
    className={`rounded-full flex justify-center items-center border-none h-11 w-11 p-2 ${className}`}
  >
    {loading ? (
      <Loading spinnerClassName="!fill-primary" />
    ) : (
      <img
        src={isFavorite ? "/favoriteFilled.svg" : "/favorite.svg"}
        alt="Favorite"
        className="rounded-full !relative !w-4 !h-4"
      />
    )}
  </Button>
);

const AddToReadListButton = ({
  loading,
  book,
  className,
}: { book: Book } & BookButtonProps): React.ReactNode => {
  const dispatch = useDispatch();
  return (
    <Button
      variant="accent"
      onClick={() =>
        dispatch(
          showModal({ data: book, type: BottomSheetTypes.ADD_BOOK_TO_READ_LIST })
        )
      }
      className={`rounded-full relative ${className}`}
    >
      <div className={`${loading ? "opacity-0" : ""}`}>I've read it</div>
      {loading && (
        <div className="absolute m-auto">
          <Loading />
        </div>
      )}
    </Button>
  );
};

const AddToBacklogButton = ({
  loading,
  className,
  book,
}: BookButtonProps & {
  book: Book;
}): React.ReactNode => {
  const dispatch = useDispatch();

  return (
    <Button
      variant="selected"
      onClick={() => {
        dispatch(showModal({ data: book, type: BottomSheetTypes.ADD_BOOK_TO_BACKLOG }));
      }}
      className={`rounded-full ${className}`}
    >
      {loading ? <Loading /> : "Add to library"}
    </Button>
  );
};

const ShowDetailsButton = ({
  loading,
  className,
  book,
}: BookButtonProps & {
  book: Book;
}): React.ReactNode => {
  const dispatch = useDispatch();
  return (
    <Button
      variant="outline"
      onClick={() =>
        dispatch(showModal({ data: book, type: BottomSheetTypes.BOOK_DETAILS }))
      }
      className={`rounded-full border-none w-28 h-10 ${className}`}
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-row gap-1">
          <h2 className="text-primary">Details</h2>
        </div>
      )}
    </Button>
  );
};

export {
  FavoriteButton,
  AddToReadListButton,
  AddToBacklogButton,
  ShowDetailsButton,
};
