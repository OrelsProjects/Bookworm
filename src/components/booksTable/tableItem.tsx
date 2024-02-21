import React, { useState } from "react";
import { Book, UserBook, UserBookData } from "../../models";
import Rating from "../rating";
import {
  AddToReadListButton,
  FavoriteButton,
  ShowDetailsButton,
} from "../buttons/bookButtons";
import { DEFAULT_READING_STATUS } from "@/src/models/readingStatus";
// import BookThumbnail from "../bookThumbnail";
import { formatDate } from "@/src/utils/dateUtils";
import toast from "react-hot-toast";
import useBook from "@/src/hooks/useBook";
import { Logger } from "@/src/logger";

interface TableItemProps {
  userBookData: UserBookData;
  className?: string;
}

const TableItem: React.FC<TableItemProps> = ({ userBookData, className }) => {
  const { favoriteBook } = useBook();
  const [loadingFavorite, setLoadingFavorite] = useState(false);

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

  // const Thumbnail = (): React.ReactNode => {
  //   return (
  //     <BookThumbnail
  //       src={userBookData.bookData?.book?.thumbnailUrl}
  //       title={userBookData.bookData.book?.title}
  //       fill
  //       className="rounded-lg !w-16 !h-24 !relative"
  //     />
  //   );
  // };

  const Title = (): React.ReactNode => (
    <div className="w-full flex items-center justify-center truncate px-2">
      <div className="truncate">{userBookData.bookData.book?.title}</div>
    </div>
  );

  const Authors = (): React.ReactNode => (
    <div className="w-full flex items-center justify-center text-foreground font-semibold truncate">
      <div className="truncate">
        {userBookData.bookData.book?.authors?.join(", ")}
      </div>
    </div>
  );

  const AddToListButton = ({
    book,
    className,
  }: {
    book: Book;
    className?: string;
  }): React.ReactNode => {
    const bookReadingStatusId =
      userBookData.readingStatus?.readingStatusId ?? DEFAULT_READING_STATUS;
    switch (bookReadingStatusId) {
      case 2:
        return <AddToReadListButton book={book} className={className} />;
      default:
        return <></>;
    }
  };

  const AditionalButtons = (): React.ReactNode => (
    <div className="flex flex-row justify-center items-center gap-2">
      {userBookData.bookData.book && (
        <>
          {userBookData.readingStatus?.readingStatusId === 1 && (
            <FavoriteButton
              loading={loadingFavorite}
              isFavorite={userBookData?.userBook?.isFavorite}
              onClick={() => onFavorite(userBookData.userBook)}
              className="max-xl:hidden"
            />
          )}
          <AddToListButton
            book={userBookData.bookData.book}
            className="max-xl:hidden"
          />
          <ShowDetailsButton book={userBookData.bookData.book} />
        </>
      )}
    </div>
  );

  const PagesGenreAndDate = (): React.ReactNode => (
    <div className="flex flex-col truncate items-center text-start">
      <div>
        <div>Pages: {userBookData.bookData.book?.numberOfPages}</div>
        <div className="truncate">
          Genre: {userBookData.bookData.mainGenre?.genreName}
        </div>
        <div>
          Date Published:{" "}
          {formatDate(
            userBookData.bookData.book?.datePublished,
            false,
            false,
            false
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`w-full h-28 grid-header-table items-center bg-primary-foreground p-2 rounded-lg ${className}`}
    >
      {/* <Thumbnail /> */}
      <Title />
      <Authors />
      <PagesGenreAndDate />
      <div className="w-full flex justify-center items-center">
        <Rating
          rating={userBookData.goodreadsData?.goodreadsRating}
          totalRatings={userBookData.goodreadsData?.goodreadsRatingsCount}
          userRating={userBookData.userBook.userRating}
          className="justify-center items-center"
        />
      </div>
      <AditionalButtons />
    </div>
  );
};

export default TableItem;
