import React, { useEffect, useState } from "react";
import { Skeleton } from "../skeleton";
import { Book, UserBook, UserBookData } from "../../models";
import { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import useBook from "@/src/hooks/useBook";
import toast from "react-hot-toast";
import { Logger } from "@/src/logger";
import { isBooksEqualExactly, removeSubtitle } from "@/src/utils/bookUtils";
import BookThumbnail from "../book/bookThumbnail";
import { Add, Bookmark, Checkmark } from "../icons";
import Title from "../book/title";
import Authors from "../book/authors";

interface BookComponentProps {
  book: Book;
  isFirstInList?: boolean;
}

const BookSearchResult: React.FC<BookComponentProps> = ({
  book,
  isFirstInList,
}) => {
  const { favoriteBook } = useBook();
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [userBookData, setUserBookData] = useState<UserBookData | undefined>(
    undefined
  );
  const userBooksData: UserBookData[] = useSelector(
    (state: RootState) => state.userBooks.userBooksData
  );

  useEffect(() => {
    const userBookData = userBooksData.find(
      (userBookData) =>
        isFirstInList && isBooksEqualExactly(userBookData.bookData.book, book)
    );
    setUserBookData(userBookData);
  }, [userBooksData]);

  const onFavorite = async (userBook: UserBook) => {
    try {
      setLoadingFavorite(true);
      await favoriteBook(userBook);
    } catch (error: any) {
      Logger.error("Failed to favorite book", {
        data: userBook,
        error,
      });
      toast.error("Something went wrong.. We're on it!");
    } finally {
      setLoadingFavorite(false);
    }
  };

  const Button = ({
    onClick,
    className,
    children,
    title,
  }: {
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
    title: string;
  }) => (
    <div
      className={`flex flex-col items-center ${className}`}
      onClick={() => onClick?.()}
    >
      {children}
      <div className="text-sm font-light">{title}</div>
    </div>
  );

  const Buttons = () => (
    <div className="flex flex-row gap-4">
      <Button title="Read?" onClick={() => {}}>
        <Add.Fill className="w-4 h-4" />
      </Button>
      <Button title="To Read">
        <Bookmark.Outline className="w-3 h-4" />
      </Button>
      <Button title="Readlist" onClick={() => {}}>
        <Checkmark.Outline className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="flex flex-row justify-start items-start gap-3 h-full">
      <div className="flex-shrink-0">
        <BookThumbnail
          src={book.thumbnailUrl}
          className="rounded-xl !relative !w-16 !h-24"
        />
      </div>
      <div className="h-24 flex flex-col justify-between">
        <div className="flex flex-col w-8">
          <Title title={book.title} />
          <Authors authors={book.authors} prefix="by" />
        </div>
        <Buttons />
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
    <div className={`flex rounded-lg shadow space-x-4 ${className}`}>
      {/* Thumbnail Skeleton */}
      <Skeleton className="w-16 h-24 rounded-xl" />

      {/* Text and Buttons Skeletons */}
      <div className="flex flex-col flex-grow justify-start items-start gap-2 mt-2">
        <Skeleton className="h-2 rounded w-1/2" />
        <Skeleton className="h-2 rounded w-1/3" />
        <div className="flex flex-row gap-4 mt-6">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-4 h-4 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default BookSearchResult;
