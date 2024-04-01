import React, { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { ThumbnailSize, getThumbnailSize } from "../../consts/thumbnail";
import { BookInListWithBook } from "../../models/bookInList";
import CustomImage from "../image";

interface BooksListThumbnailProps {
  booksInList?: BookInListWithBook[];
  thumbnailSize?: ThumbnailSize;
  className?: string;
  Icon?: React.ReactNode;
  loading?: boolean;
}

type Props = BooksListThumbnailProps & React.HTMLProps<HTMLDivElement>;

const BooksListThumbnail: React.FC<Props> = ({
  booksInList,
  className,
  thumbnailSize = "md",
  Icon,
  loading,
  ...props
}) => {
  const [thumbnailBooks, setThumbnailBooks] = useState<BookInListWithBook[]>(
    []
  );

  useEffect(() => {
    const sortedBooksInList = [...(booksInList ?? [])];
    sortedBooksInList.sort((a, b) => {
      return a.position - b.position;
    });
    setThumbnailBooks(sortedBooksInList?.slice(0, 4) ?? []);
  }, [booksInList]);

  const Thumbnail1Book = () => {
    const bookInList = thumbnailBooks[0];
    return (
      <CustomImage
        thumbnailSize={thumbnailSize}
        loading="lazy"
        src={bookInList.book.thumbnailUrl}
        alt={`${bookInList.book.title} cover`}
        key={props.key || `list-thumbnail-${bookInList.bookId}`}
        className={`w-full h-full`}
        style={{
          backgroundColor: bookInList.book.thumbnailColor || "transparent",
        }}
      />
    );
  };

  const Thumbnail2Or3Books = (booksCount: number = 2) => {
    return (
      <div
        className="flex gap-1 w-full h-full relative"
        key={props.key || `list-thumbnail-${thumbnailBooks[0].bookId}`}
      >
        <div className="w-full h-full absolute z-10">
          <CustomImage
            thumbnailSize={thumbnailSize}
            loading="lazy"
            src={thumbnailBooks[0].book.thumbnailUrl}
            alt={`${thumbnailBooks[0].book.title} cover`}
            className={`w-full h-full`}
            style={{
              backgroundColor:
                thumbnailBooks[0].book.thumbnailColor || "transparent",
            }}
          />
        </div>
        <div className="w-full h-full z-20 flex flex-row items-end">
          {thumbnailBooks.slice(1, booksCount).map((bookInList) => (
            <CustomImage
              thumbnailSize={thumbnailSize}
              loading="lazy"
              key={props.key || bookInList.bookId}
              src={bookInList.book.thumbnailUrl}
              alt={props.alt || `${bookInList.book.title} cover`}
              className={`${
                booksCount === 2 ? "w-full h-full absolute top-1/2" : "w-1/2"
              } h-1/2`}
              style={{
                backgroundColor:
                  bookInList.book.thumbnailColor || "transparent",
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const Thumbnail2Books = () => Thumbnail2Or3Books(2);

  const Thumbnail3Books = () => Thumbnail2Or3Books(3);

  const Thumbnail4Books = () => {
    return thumbnailBooks.map((bookInList) => (
      <div
        className={`w-1/2 h-1/2`}
        key={props.key || `list-thumbnail-${bookInList.bookId}`}
      >
        <CustomImage
          thumbnailSize={thumbnailSize}
          loading="lazy"
          src={bookInList.book.thumbnailUrl}
          alt={`${bookInList.book.title} cover`}
          className={`w-full h-full`}
          style={{
            backgroundColor: bookInList.book.thumbnailColor || "transparent",
          }}
        />
      </div>
    ));
  };

  const ThumbnailDefault = () => {
    return <div className="w-full h-full" style={{ background: "#D9D9D9" }} />;
  };

  const Thumbnail = () => {
    let booksCount = thumbnailBooks.length;
    if (!thumbnailBooks) {
      booksCount = 0;
    }
    switch (booksCount) {
      case 1:
        return <Thumbnail1Book />;
      case 2:
        return <Thumbnail2Books />;
      case 3:
        return <Thumbnail3Books />;
      case 4:
        return <Thumbnail4Books />;
      default:
        return <ThumbnailDefault />;
    }
  };

  return (
    <div
      className={`flex flex-col flex-wrap relative items-start justify-center ${
        getThumbnailSize(thumbnailSize).className
      } rounded-xl bg-clip-border	overflow-hidden ${className ?? ""}`}
      {...props}
    >
      {!loading ? (
        <Thumbnail />
      ) : (
        <Skeleton
          className={`${getThumbnailSize(thumbnailSize).className} rounded-xl`}
        />
      )}
      {Icon}
    </div>
  );
};

export default BooksListThumbnail;
