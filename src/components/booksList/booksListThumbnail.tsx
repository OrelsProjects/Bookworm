import React, { useState, useEffect } from "react";
import { Book } from "../../models";
import { Skeleton } from "../skeleton";
import { ThumbnailSize, getThumbnailSize } from "../../consts/thumbnail";

interface BooksListThumbnailProps {
  books?: Book[];
  thumbnailSize?: ThumbnailSize;
  className?: string;
  Icon?: React.ReactNode;
  loading?: boolean;
}

type Props = BooksListThumbnailProps & React.HTMLProps<HTMLDivElement>;

const BooksListThumbnail: React.FC<Props> = ({
  books,
  className,
  thumbnailSize = "md",
  Icon,
  loading,
  ...props
}) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [thumbnailBooks, setThumbnailBooks] = useState<Book[]>(
    books?.slice(0, 4) ?? []
  );
  // Preload images
  useEffect(() => {
    const booksForThumbnail =
      books
        ?.filter((book) => book !== undefined && book.thumbnailUrl)
        .slice(0, 4) ?? [];
    setThumbnailBooks(booksForThumbnail);
    let imagesToLoad = booksForThumbnail.map(() => new Image());
    let imagesLoadedCount = 0;
    if (booksForThumbnail?.length === 0) {
      setImagesLoaded(true);
    }
    booksForThumbnail.forEach((book, index) => {
      if (book.thumbnailUrl) {
        imagesToLoad[index].src = book.thumbnailUrl;
        imagesToLoad[index].onload = () => {
          imagesLoadedCount++;
          if (imagesLoadedCount === booksForThumbnail.length) {
            setImagesLoaded(true);
          }
        };
        imagesToLoad[index].onerror = () => {
          imagesLoadedCount++;
          if (imagesLoadedCount === booksForThumbnail.length) {
            setImagesLoaded(true);
          }
        };
      }
    });
  }, [books]);

  const Thumbnail1Book = () => {
    const book = thumbnailBooks[0];
    return (
      <img
        loading="lazy"
        src={book.thumbnailUrl}
        alt={`${book.title} cover`}
        className={`w-full h-full`}
        style={{
          backgroundColor: book.thumbnailColor || "transparent",
        }}
      />
    );
  };

  const Thumbnail2Or3Books = (booksCount: number = 2) => {
    return (
      <div className="flex gap-1 w-full h-full relative">
        <div className="w-full h-full absolute z-10">
          <img
            loading="lazy"
            src={thumbnailBooks[0].thumbnailUrl}
            alt={`${thumbnailBooks[0].title} cover`}
            className={`w-full h-full`}
            style={{
              backgroundColor:
                thumbnailBooks[0].thumbnailColor || "transparent",
            }}
          />
        </div>
        <div className="w-full h-full z-20 flex flex-row items-end">
          {thumbnailBooks.slice(1, booksCount).map((book) => (
            <img
              loading="lazy"
              key={props.key || book.bookId}
              src={book.thumbnailUrl}
              alt={props.alt || `${book.title} cover`}
              className={`${
                booksCount === 2 ? "w-full h-full absolute top-1/2" : "w-1/2"
              } h-1/2`}
              style={{
                backgroundColor: book.thumbnailColor || "transparent",
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
    return thumbnailBooks.map((book) => (
      <div key={book.bookId} className={`w-1/2 h-1/2`}>
        <img
          loading="lazy"
          src={book.thumbnailUrl}
          alt={`${book.title} cover`}
          className={`w-full h-full`}
          style={{
            backgroundColor: book.thumbnailColor || "transparent",
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
      {imagesLoaded && !loading ? (
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
