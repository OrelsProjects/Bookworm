"use client";

import React from "react";
import { Book, GoodreadsData } from "../../models";
import Image from "next/image";
import { darkenColor } from "../../utils/thumbnailUtils";
import Rating from "../rating";
import { Bookmark, Checkmark, Add } from "../icons";
import { IconBaseProps } from "react-icons";
import { removeSubtitle } from "../../utils/bookUtils";

export default function Modal({
  book,
  goodreadsData,
}: {
  book: Book;
  goodreadsData: GoodreadsData;
}) {
  const darkenedColor = darkenColor(book.thumbnailColor);

  const BookDetails = () => (
    <div className="h-5/6 w-full bg-background absolute bottom-0 rounded-t-5xl flex justify-center items-center">
      <div className="absolute !-top-12 w-full">
        <div className="flex flex-col relative w-full">
          <div className="h-44 w-full flex justify-start">
            <ThumbnailAndDetails />
          </div>
          <Buttons />
          <Summary />
        </div>
      </div>
    </div>
  );

  const ThumbnailAndDetails = () => (
    <div className="flex flex-row items-center justify-center gap-4 absolute !left-8">
      <Image
        src={book.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
        alt={book.title}
        layout="fill"
        objectFit="cover"
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
    icon: React.FC<IconBaseProps>,
    height?: number,
    width?: number,
    color?: string
  ) => (
    <div className="flex flex-col justify-center items-center gap-2">
      {icon({ size: height || width, color: color || darkenedColor })}
      <div className="text-foreground text-lg">{title}</div>
    </div>
  );

  const Buttons = () => (
    <div className="h-24 flex flex-row justify-evenly items-center gap-4">
      {ButtonImage("Read", Add.Fill, 35, 35)}
      {ButtonImage("Wishlist", Bookmark.Fill, 35, 35)}
      {ButtonImage("Add to list", Checkmark.Outline, 35, 35, "white")}
    </div>
  );

  const Summary = () => (
    <div className="flex flex-col gap-1 px-8">
      <div className="text-foreground font-bold text-xl">Summary</div>
      <div className="text-foreground overflow-auto max-h-80">
        {book.description}
      </div>
    </div>
  );

  return (
    <div
      className="bg-background w-full h-full flex justify-center items-center flex-col"
      style={{ background: darkenedColor }}
    >
      <BookDetails />
    </div>
  );
}
