"use client";

import React from "react";

import Book from "../../models/book";
import useBook from "../../hooks/useBook";
import { UserBookData } from "../../models/userBook";
import BookButtons from "../book/bookButtons";
import BookThumbnail from "../book/bookThumbnail";
import { ModalContent } from "./modalContainers";
import BookGeneralDetails from "./_components/bookGeneralDetails";
import ReadMoreText from "../readMoreText";
import { BookInList } from "../../models/bookInList";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectAuth } from "../../lib/features/auth/authSlice";

type ModalBookDetailsProps = {
  book: Book;
  bookInList?: BookInList;
};

const ModalBookDetails: React.FC<ModalBookDetailsProps> = ({
  book,
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

  React.useEffect(() => {
    const bookFullData = getBookFullData(book);
    setTitle(bookFullData?.bookData?.book?.title ?? book.title);
    setAuthors(bookFullData?.bookData?.book?.authors ?? book.authors);
    setGoodreadsRating(bookFullData?.goodreadsData?.goodreadsRating);
  }, [userBooksData]);

  const Summary = () =>
    book.description ? (
      <div className="w-full flex relative flex-col justify-start gap-1">
        <div className="flex flex-col gap-4 text-foreground h-full font-thin shadow-inner pb-6">
          <div>
            <div className="text-foreground font-bold text-xl">Summary</div>
            <ReadMoreText
              text={book?.description}
              maxLines={bookInList ? 3 : 6}
              className={"text-xl text-mute !overflow-none"}
            />
          </div>
          {bookInList && (
            <div>
              <div className="text-foreground font-bold text-xl">
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
      src={book.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
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
