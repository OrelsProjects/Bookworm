"use client";

import React, { useMemo } from "react";

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
import { UserBookData } from "../../models/userBook";

type ModalBookDetailsProps = {
  bookData: Book | UserBookData;
  bookInList?: BookInList;
};

const ModalBookDetails: React.FC<ModalBookDetailsProps> = ({
  bookData,
  bookInList,
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

  const book: Book | null = useMemo(() => {
    console.log(bookData);
    const x = bookData as Book;
    debugger;
    return bookData as Book;
  }, [bookData]);

  const userBookData: UserBookData | null = useMemo(() => {
    try {
      return bookData as UserBookData;
    } catch (e) {
      return null;
    }
  }, [bookData]);

  const bookFullData = useMemo(() => {
    return getBookFullData(book);
  }, [userBooksData]);

  React.useEffect(() => {
    setTitle(bookFullData?.bookData?.book?.title ?? book?.title);
    setAuthors(bookFullData?.bookData?.book?.authors ?? book?.authors);
    setGoodreadsRating(
      bookFullData?.goodreadsData?.goodreadsRating ??
        userBookData?.goodreadsData?.goodreadsRating
    );
  }, [userBooksData]);

  const Summary = () =>
    book?.description ? (
      <div className="w-full flex relative flex-col justify-start gap-1">
        <div className="flex flex-col gap-4 text-foreground h-full font-thin shadow-inner pb-6">
          <div>
            <div className="text-foreground font-bold text-xl">Summary</div>
            <ReadMoreText
              text={book?.description}
              maxLines={bookInList ? 3 : 6}
              className={"text-xl text-foreground font-thin !overflow-none"}
            />
          </div>
          {bookInList && (
            <div>
              <div className="text-xl text-foreground font-extralight">
                List Creator Comment
              </div>
              <ReadMoreText text={bookInList.comments} maxLines={3} />
            </div>
          )}
        </div>
        <div className="absolute bottom-0 w-full extra-text-shadow"></div>
      </div>
    ) : (
      <></>
    );

  const Thumbnail = () => (
    <BookThumbnail
      src={book?.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
      book={book}
      thumbnailSize="lg"
    />
  );

  const ButtonsRow = () => (
    <Buttons book={book} iconSize="lg" showAddToListButton={!!user} />
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
