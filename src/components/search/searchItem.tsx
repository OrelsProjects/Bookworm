import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SquareSkeleton, LineSkeleton } from "../skeleton";
import { Book, UserBook, UserBookData } from "../../models";
import { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import useBook from "@/src/hooks/useBook";
import {
  AddToBacklogButton,
  FavoriteButton,
  ShowDetailsButton,
} from "../buttons/bookButtons";
import { compareBooks } from "@/src/models/book";
import toast from "react-hot-toast";
import AddBookToBacklog from "../modals/addBookToReadList";

interface SearchItemProps {
  book: Book;
  onAddToLibrary: (book: Book) => void;
}

const SearchItem: React.FC<SearchItemProps> = ({ book, onAddToLibrary }) => {
  const { favoriteBook } = useBook();
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [userBookData, setUserBookData] = useState<UserBookData | undefined>(
    undefined
  );
  const userBooksData: UserBookData[] = useSelector(
    (state: RootState) => state.userBooks.userBooksData
  );

  useEffect(() => {
    const userBookData = userBooksData.find((userBookData) =>
      compareBooks(userBookData.bookData.book, book)
    );
    setUserBookData(userBookData);
  }, [userBooksData]);

  const onFavorite = async (userBook: UserBook) => {
    try {
      setLoadingFavorite(true);
      await favoriteBook(userBook);
    } catch (error) {
      toast.error("Something went wrong.. We're on it!");
    } finally {
      setLoadingFavorite(false);
    }
  };

  return (
    <div className="bg-card h-22 rounded-lg text-foreground p-2 flex justify-between items-center shadow-md">
      <div className="flex flex-row justify-start items-center gap-3 w-2/5">
        <div className="flex-shrink-0">
          <Image
            src={book.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
            alt="Book cover"
            height={72}
            width={48}
            className="rounded-md"
          />
        </div>
        <h2 className="text-xl text-foreground line-clamp-2 flex-grow">
          {book.title}
        </h2>
      </div>

      <div className="flex flex-row gap-8 justify-center items-center">
        <p className="text-primary">by {book.authors?.join(", ")}</p>
        <p className="text-muted">{book.numberOfPages} Pages</p>
        <div className="flex flex-row gap-2">
          {userBookData && (
            <FavoriteButton
              loading={loadingFavorite}
              onClick={() => onFavorite(userBookData.userBook)}
              isFavorite={userBookData.userBook.isFavorite ?? false}
            />
          )}
          <AddToBacklogButton book={book} />
          <ShowDetailsButton book={book} />
        </div>
      </div>
    </div>
  );
};

interface SearchItemSkeletonProps {
  className?: string;
}

export const SearchItemSkeleton: React.FC<SearchItemSkeletonProps> = ({
  className,
}) => {
  return (
    <div
      className={`bg-gray-600 flex items-center p-4 rounded-lg shadow space-x-4 ${className}`}
    >
      {/* Thumbnail Skeleton */}
      <SquareSkeleton className="h-14 w-10 rounded" />

      {/* Text Skeletons */}
      <div className="flex flex-col flex-grow justify-center">
        <LineSkeleton className="h-4 rounded w-1/2 mb-2" />
      </div>

      {/* Button Skeletons */}
      <div className="flex flex-row gap-2 items-center">
        <LineSkeleton className="h-4 w-14 rounded-full" />
        <LineSkeleton className="h-4 w-14 rounded-full" />

        <SquareSkeleton className="h-10 w-24 rounded-full" />
        <SquareSkeleton className="h-10 w-24 rounded-full" />
      </div>
    </div>
  );
};

export default SearchItem;
