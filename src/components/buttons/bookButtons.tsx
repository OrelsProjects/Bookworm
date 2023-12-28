import React from "react";
import { Button } from "../button";
import Image from "next/image";
import Loading from "../loading";
import { Book } from "@/src/models";
import { useDispatch } from "react-redux";
import { showBookDetailsModal } from "@/src/lib/features/modal/modalSlice";

export interface BookButtonProps {
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

const FavoriteButton = ({
  loading,
  className,
  onClick,
  isFavorite,
}: BookButtonProps & { isFavorite: boolean }): React.ReactNode => (
  <Button
    onClick={onClick}
    className={`rounded-full border-none h-11 w-11 p-1 ${className}`}
  >
    {loading ? (
      <Loading />
    ) : (
      <Image
        src={isFavorite ? "/favoriteFilled.svg" : "/favorite.svg"}
        alt="Favorite"
        width={16}
        height={16}
        className="rounded-full"
      />
    )}
  </Button>
);

const ReadListButton = ({
  loading,
  className,
  onClick,
}: BookButtonProps): React.ReactNode => (
  <Button
    variant="accent"
    onClick={onClick}
    className={`rounded-full ${className}`}
  >
    {loading ? <Loading /> : "I've read it"}
  </Button>
);

const BacklogButton = ({
  loading,
  className,
  onClick,
}: BookButtonProps): React.ReactNode => (
  <Button
    variant="selected"
    onClick={onClick}
    className={`rounded-full ${className}`}
  >
    {loading ? <Loading /> : "Add to library"}
  </Button>
);

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
      onClick={() => dispatch(showBookDetailsModal(book))}
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

export { FavoriteButton, ReadListButton, BacklogButton, ShowDetailsButton };
