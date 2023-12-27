import React from "react";
import { Button } from "../button";
import Image from "next/image";
import Loading from "../loading";

export interface BookButtonProps {
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export const FavoriteButton = ({
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

export const ReadListButton = ({
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

export const BacklogButton = ({
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
