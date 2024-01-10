import React from "react";
import { Book, UserBookData } from "../../models";
import Rating from "../rating";
import { AddToReadListButton, ShowDetailsButton } from "../buttons/bookButtons";
import { DEFAULT_READING_STATUS } from "@/src/models/readingStatus";
import Image from "next/image";
import BookThumbnail from "../bookThumbnail";

interface TableItemProps {
  userBookData: UserBookData;
}

const TableItem: React.FC<TableItemProps> = ({ userBookData }) => {
  const Thumbnail = (): React.ReactNode => {
    return (
      <BookThumbnail
        src={userBookData.bookData?.book?.thumbnailUrl}
        title={userBookData.bookData.book?.title}
        width={64}
        height={80}
        className="rounded-lg"
      />
    );
  };

  const Title = (): React.ReactNode => (
    <div className="truncate">{userBookData.bookData.book?.title}</div>
  );

  const Authors = (): React.ReactNode => (
    <div className="w-full flex items-center justify-center text-primary font-semibold truncate">
      <div className="truncate">
        {userBookData.bookData.book?.authors?.join(", ")}
      </div>
    </div>
  );

  const AddToListButton = ({ book }: { book: Book }): React.ReactNode => {
    const bookReadingStatusId =
      userBookData.readingStatus?.readingStatusId ?? DEFAULT_READING_STATUS;
    switch (bookReadingStatusId) {
      case 2:
        return <AddToReadListButton book={book} />;
      default:
        return <></>;
    }
  };

  const AditionalButtons = (): React.ReactNode => (
    <div className="flex flex-row justify-center items-center gap-2">
      {userBookData.bookData.book && (
        <>
          <AddToListButton book={userBookData.bookData.book} />
          <ShowDetailsButton book={userBookData.bookData.book} />
        </>
      )}
    </div>
  );

  const PagesGenreAndDate = (): React.ReactNode => (
    <div className="flex flex-col truncate items-center text-start">
      <div>
        <div>Pages: {userBookData.bookData.book?.numberOfPages}</div>
        <div>Genre: {userBookData.bookData.book?.mainGenreId}</div>
        <div>Date: {userBookData.bookData.book?.datePublished}</div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full grid-header-table items-center bg-primary-foreground p-2 rounded-lg">
      <Thumbnail />
      <Title />
      <Authors />
      <PagesGenreAndDate />
      <div className="w-full flex justify-center items-center">
        <Rating
          rating={userBookData.goodreadsData?.goodreadsRating}
          totalRatings={userBookData.goodreadsData?.goodreadsRatingsCount}
          userRating={userBookData.userBook.userRating}
        />
      </div>
      <AditionalButtons />
    </div>
  );
};

export default TableItem;
