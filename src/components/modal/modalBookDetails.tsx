"use client";

import React, { useEffect, useMemo } from "react";

import Book from "../../models/book";
import useBook from "../../hooks/useBook";
import BookButtons from "../book/bookButtons";
import BookThumbnail from "../book/bookThumbnail";
import { ModalContent } from "./modalContainers";
import BookGeneralDetails from "./_components/bookGeneralDetails";
import ReadMoreText from "../readMoreText";
import { BookInList } from "../../models/bookInList";
import { useSelector } from "react-redux";
import { selectAuth } from "../../lib/features/auth/authSlice";
import GenresTabs from "../genresTabs";

export interface ModalBookDetailsProps {
  bookData: Book;
  bookInList?: BookInList;
  curator?: string;
}

const ModalBookDetails: React.FC<ModalBookDetailsProps> = ({
  bookData,
  bookInList,
  curator,
}) => {
  const { user } = useSelector(selectAuth);
  const { Buttons } = BookButtons();
  const { getBookFullData, userBooksData } = useBook();

  const [title, setTitle] = React.useState<string | null>(null);
  const [authors, setAuthors] = React.useState<string[] | undefined | null>(
    null
  );
  const [goodreadsRating, setGoodreadsRating] = React.useState<
    number | undefined | null
  >(null);

  const curatorsFirstNames = useMemo(() => {
    return curator?.split(" ")[0];
  }, [curator]);

  const book: Book | null = useMemo(() => {
    return bookData as Book;
  }, [bookData]);

  const bookFullData = useMemo(() => {
    return getBookFullData(book);
  }, [userBooksData]);

  React.useEffect(() => {
    setTitle(bookFullData?.bookData?.book?.title ?? book?.title);
    setAuthors(bookFullData?.bookData?.book?.authors ?? book?.authors);
    setGoodreadsRating(bookFullData?.goodreadsData?.goodreadsRating);
  }, [userBooksData]);

  const Summary = () => (
    <div className="w-full flex relative flex-col justify-start gap-1 ">
      <GenresTabs genres={book?.genres ?? []} take={3} className="mb-6 mt-6"/>

      <div className="flex flex-col gap-4 text-foreground h-full font-thin shadow-inner pb-6">
        {bookInList && bookInList.comments && (
          <div>
            <div className="text-foreground font-bold text-xl">
              {curatorsFirstNames + "'s" ?? "List Creator"} Comment
            </div>
            {bookInList.comments ? (
              <ReadMoreText
                text={bookInList.comments}
                maxLines={3}
                className={"max-w-full"}
              />
            ) : (
              <div>
                {curator ?? "The List Creator"} Didn't Add His Comment Yet
              </div>
            )}
          </div>
        )}
        {book?.description && (
          <div>
            <div className="text-foreground font-bold text-xl">Summary</div>
            <ReadMoreText
              text={book?.description}
              maxLines={bookInList ? 3 : 6}
              className={"max-w-full"}
            />
          </div>
        )}
      </div>
    </div>
  );

  const Thumbnail = () => (
    <BookThumbnail
      src={book?.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
      book={book}
      thumbnailSize="xl"
    />
  );

  const ButtonsRow = () => (
    <div className="w-full md:w-fit flex flex-col gap-8 flex-shrink-0">
      <Buttons book={book} iconSize="sm" showAddToListButton={!!user} />
    </div>
  );

  return (
    <ModalContent
      thumbnail={<Thumbnail />}
      thumbnailDetails={
        <BookGeneralDetails
          title={title}
          authors={authors}
          goodreadsRating={goodreadsRating}
        />
      }
      buttonsRow={<ButtonsRow />}
      bottomSection={<Summary />}
    />
  );
};

export default ModalBookDetails;
