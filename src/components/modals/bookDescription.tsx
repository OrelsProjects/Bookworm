import { Book, UserBook, UserBookData } from "@/src/models";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Rating from "../rating";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import {
  FavoriteButton,
  AddToBacklogButton,
} from "../buttons/bookButtons";
import useBook from "@/src/hooks/useBook";
import { compareBooks } from "@/src/models/book";
import toast from "react-hot-toast";

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
  const { favoriteBook, addUserBook, getBookGoodreadsData } = useBook();
  const [bookToShow, setBookToShow] = useState<Book | null>(null); // To avoid bugs when closing the modal
  const [goodreadsData, setGoodreadsData] = useState<any>(null);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingGoodreadsData, setGoodreadsDataLoading] = useState(false);
  const [showAddBookToBacklog, setShowAddBookToBacklog] = useState(false);
  const [showAddBookToReadList, setShowAddBookToReadList] = useState(false);
  const [userBookData, setUserBookData] = useState<UserBookData | undefined>();
  const userBooksData: UserBookData[] = useSelector(
    (state: RootState) => state.userBooks.userBooksData
  );

  const loadBookGoodreadsData = async () => {
    if (loadingGoodreadsData) {
      return;
    }
    setGoodreadsDataLoading(true);

    try {
      const result = await getBookGoodreadsData(book);
      setGoodreadsData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setGoodreadsDataLoading(false);
    }
  };

  useEffect(() => {
    if (book) {
      setBookToShow(book);
    }
  }, [book]);

  useEffect(() => {
    const userBookData = userBooksData.find((userBookData) =>
      compareBooks(userBookData.bookData.book, book)
    );
    setUserBookData(userBookData);
    setGoodreadsData(userBookData?.goodreadsData);

    if (!userBookData || !userBookData?.goodreadsData) {
      loadBookGoodreadsData();
    }
  }, [userBooksData]);

  const BookTitle = (): React.ReactNode => {
    return (
      <div className="flex flex-col flex-wrap gap-2 max-w-2xl">
        <p className="text-3xl line-clamp-1">{bookToShow?.title}</p>
        <p className="text-lg font-thin">{bookToShow?.subtitle}</p>
      </div>
    );
  };

  const BookDescription = (): React.ReactNode => {
    return (
      <div className="flex flex-col flex-wrap gap-2 max-w-2xl">
        <p className="text-md line-clamp-3 font-thin">
          {bookToShow?.description}
        </p>
      </div>
    );
  };

  const AuthorsAndPages = (): React.ReactNode => {
    return (
      <div className="flex flex-col">
        <p className="text-md text-primary">
          {bookToShow?.authors?.join(", ")}
        </p>
        <p className="text-md font-thin">{bookToShow?.numberOfPages} Pages</p>
      </div>
    );
  };

  const PublishDate = (): React.ReactNode => {
    return (
      <div className="flex flex-col">
        <p className="text-md">Published: {bookToShow?.datePublished}</p>
      </div>
    );
  };

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
    <div className={`flex flex-row gap-8 ${className}`}>
      <Image
        src={bookToShow?.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
        placeholder="blur"
        blurDataURL="/thumbnailPlaceholder.png"
        alt={bookToShow?.title ?? "Book cover"}
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
          loading={loadingGoodreadsData}
          rating={goodreadsData?.goodreadsRating}
          totalRatings={goodreadsData?.goodreadsRatingsCount}
          userRating={userBookData?.userBook.userRating}
          goodreadsUrl={goodreadsData?.goodreadsUrl}
        />
      </div>

      <div className="flex flex-row items-end gap-2">
        {userBookData ? (
          <FavoriteButton
            loading={loadingFavorite}
            onClick={() => onFavorite(userBookData.userBook)}
            isFavorite={userBookData.userBook.isFavorite ?? false}
          />
        ) : (
          <AddToBacklogButton book={book} />
        )}
        {userBookData && userBookData.readingStatus?.readingStatusId !== 1 && (
          <AddToBacklogButton book={book} />
        )}
      </div>
    </div>
  );
}

export default BookDescription;
