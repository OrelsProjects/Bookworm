import { Book, UserBookData } from "@/src/models";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Rating from "../rating";
import { Button } from "../button";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import {
  FavoriteButton,
  BacklogButton,
  ReadListButton,
} from "../buttons/bookButtons";
import useBook from "@/src/hooks/useBook";
import { compareBooks } from "@/src/models/book";

export interface BookDescriptionProps {
  book: Book;
  className?: string;
  onFavorite?: () => void;
  onAddToBacklog?: () => void;
  onAddToReadList?: () => void;
}

export function BookDescription({
  book,
  className,
}: BookDescriptionProps): React.ReactNode {
  const { favoriteBook, addUserBook } = useBook();
  const [showAddBookToBacklog, setShowAddBookToBacklog] = useState(false);
  const [showAddBookToReadList, setShowAddBookToReadList] = useState(false);
  const [userBookData, setUserBookData] = useState<UserBookData | undefined>();
  const userBooksData: UserBookData[] = useSelector(
    (state: RootState) => state.userBooks.userBooksData
  );

  useEffect(() => {
    const userBookData = userBooksData.find((userBookData) =>
      compareBooks(userBookData.bookData.book, book)
    );
    setUserBookData(userBookData);
  }, [userBooksData]);

  const BookTitle = (): React.ReactNode => {
    return (
      <div className="flex flex-col flex-wrap gap-2 max-w-2xl">
        <p className="text-3xl line-clamp-1">{book.title}</p>
        <p className="text-lg font-thin">{book.subtitle}</p>
      </div>
    );
  };

  const BookDescription = (): React.ReactNode => {
    return (
      <div className="flex flex-col flex-wrap gap-2 max-w-2xl">
        <p className="text-md line-clamp-3 font-thin">{book.description}</p>
      </div>
    );
  };

  const AuthorsAndPages = (): React.ReactNode => {
    return (
      <div className="flex flex-col">
        <p className="text-md text-primary">{book.authors?.join(", ")}</p>
        <p className="text-md font-thin">{book.numberOfPages} Pages</p>
      </div>
    );
  };

  const PublishDate = (): React.ReactNode => {
    return (
      <div className="flex flex-col">
        <p className="text-md">Published: {book.datePublished}</p>
      </div>
    );
  };

  return (
    <div className={`flex flex-row gap-8 ${className}`}>
      <Image
        src={book.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
        placeholder="blur"
        blurDataURL="/thumbnailPlaceholder.png"
        alt={book.title}
        width={250}
        height={350}
        className="rounded-lg"
      />
      <div className="flex flex-col gap-4">
        <BookTitle />
        <BookDescription />
        <AuthorsAndPages />
        <PublishDate />
        <Rating
          rating={3.6}
          totalRatings={300}
          userRating={4.2}
          goodreadsUrl="www.goodreads.com/"
        />
      </div>

      <div className="flex flex-row items-end gap-2">
        <BacklogButton onClick={() => setShowAddBookToReadList(true)} />
        <ReadListButton onClick={() => setShowAddBookToReadList(true)} />
        {userBookData && (
          <FavoriteButton
            onClick={() => favoriteBook(userBookData.userBook)}
            isFavorite={userBookData.userBook.isFavorite ?? false}
          />
        )}
      </div>
    </div>
  );
}

export default BookDescription;
