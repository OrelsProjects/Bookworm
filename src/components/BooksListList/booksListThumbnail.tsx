import React, { useState, useEffect } from "react";
import { Book } from "../../models";
import { Skeleton } from "../skeleton";

export interface BookThumbnailProps {
  books: Book[];
  className?: string;
}

const BooksListThumbnail: React.FC<BookThumbnailProps> = ({ books }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [thumbnailBooks, setThumbnailBooks] = useState<Book[]>(
    books.slice(0, 4)
  );
  // Preload images
  useEffect(() => {
    setThumbnailBooks(books.slice(0, 4));
    let imagesToLoad = thumbnailBooks.map((book) => new Image());
    let imagesLoadedCount = 0;
    if (books.length === 0) {
      setImagesLoaded(true);
    }
    thumbnailBooks.forEach((book, index) => {
      if (book.thumbnailUrl) {
        imagesToLoad[index].src = book.thumbnailUrl;
        imagesToLoad[index].onload = () => {
          imagesLoadedCount++;
          if (imagesLoadedCount === thumbnailBooks.length) {
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
        src={book.thumbnailUrl}
        alt={`${book.title} cover`}
        className={`w-full h-full`}
        style={{
          backgroundColor: book.thumbnailColor || "transparent",
        }}
      />
    );
  };

  const Thumbnail2Books = () => {
    const book = thumbnailBooks[0];
    return (
      <img
        src={book.thumbnailUrl}
        alt={`${book.title} cover`}
        className={`w-full h-full`}
        style={{
          backgroundColor: book.thumbnailColor || "transparent",
        }}
      />
    );
  };

  const Thumbnail3Books = () => {
    return (
      <div className="flex gap-1 w-full h-full relative">
        <div className="w-full h-full absolute z-10">
          <img
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
          {thumbnailBooks.slice(1, 3).map((book) => (
            <img
              key={book.bookId}
              src={book.thumbnailUrl}
              alt={`${book.title} cover`}
              className={`w-1/2 h-1/2`}
              style={{
                backgroundColor: book.thumbnailColor || "transparent",
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const Thumbnail4Books = () => {
    return thumbnailBooks.map((book) => (
      <div key={book.bookId} className={`w-1/2 h-1/2`}>
        <img
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
    <div className="flex flex-col flex-wrap items-start justify-center w-24 h-32 rounded-2xl bg-clip-border	overflow-hidden">
      {imagesLoaded ? (
        <Thumbnail />
      ) : (
        <Skeleton className="w-24 h-32 rounded-2xl" />
      )}
    </div>
  );
};

export default BooksListThumbnail;
