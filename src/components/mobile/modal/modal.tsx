"use client";

import React from "react";
import { Book, GoodreadsData } from "../../../models";

import { darkenColor } from "../../../utils/thumbnailUtils";
import Rating from "../../rating";
import { removeSubtitle } from "../../../utils/bookUtils";

export default function Modal({
  book,
  goodreadsData,
  children,
}: {
  book: Book;
  goodreadsData: GoodreadsData;
  children: React.ReactNode;
}) {
  const darkenedColor = darkenColor(book.thumbnailColor);

  const ThumbnailAndDetails = () => (
    <div className="flex flex-row items-center justify-center gap-4 absolute !left-8">
      <img
        src={book.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
        alt={book.title}
        className="rounded-lg !w-28 !h-44 !relative"
      />
      <div className="flex flex-col justify-center items-start gap-4 mt-14">
        <div className="flex flex-col justify-center items-start gap-1">
          <div className="font text-foreground line-clamp-1 font-bold text-xl pr-2">
            {removeSubtitle(book.title)}
          </div>
          <div
            className="text-lg text-foreground"
            style={{ color: darkenedColor }}
          >
            {book.authors?.join(", ")}
          </div>
        </div>
        <Rating rating={goodreadsData.goodreadsRating} />
      </div>
    </div>
  );

  const ButtonImage = (
    title: string,
    Icon: React.ElementType,
    height?: number,
    width?: number,
    color?: string
  ) => (
    <div className="flex flex-col justify-center items-center gap-2">
      <Icon size={height || width} color={color || darkenedColor} />
      <div className="text-foreground text-lg">{title}</div>
    </div>
  );

  return (
    <div
      className="bg-background w-full h-full flex justify-center items-center flex-col"
      style={{ background: darkenedColor }}
    >
      <div className="h-5/6 w-full bg-background absolute bottom-0 rounded-t-5xl flex justify-center items-center">
        <div className="absolute !-top-12 w-full">
          <div className="flex flex-col relative w-full">
            <div className="h-44 w-full flex justify-start">
              <ThumbnailAndDetails />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
