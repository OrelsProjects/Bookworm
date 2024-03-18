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

type ModalBookDetailsProps = {
  book: Book;
  bookInList?: BookInList;
};

const ModalBookDetails: React.FC<ModalBookDetailsProps> = ({
  book,
  bookInList,
}) => {
  const { getBookFullData, userBooksData } = useBook();
  const [bookData, setBookData] = React.useState<
    UserBookData | null | undefined
  >(null);

  React.useEffect(() => {
    const bookFullData = getBookFullData(book);
    setBookData(bookFullData);
  }, [userBooksData]);

  const Summary = () =>
    book.description ? (
      <div className="w-full flex relative flex-col justify-start gap-1 overflow-auto">
        <div className="flex flex-col gap-4 text-foreground overflow-auto h-full scrollbar-hide font-thin shadow-inner pb-6">
          <div>
            <div className="text-foreground font-bold text-xl">Summary</div>
            <ReadMoreText
              text={book?.description}
              maxLines={bookInList ? 3 : 6}
              className={"text-xl text-mute"}
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

  const ButtonsRow = () => <BookButtons book={book} iconSize="lg" />;

  return (
    <ModalContent
      thumbnail={<Thumbnail />}
      thumbnailDetails={
        bookData && (
          <BookGeneralDetails
            title={bookData.bookData.book?.title}
            authors={bookData.bookData.book?.authors}
            goodreadsRating={bookData.goodreadsData?.goodreadsRating}
          />
        )
      }
      buttonsRow={<ButtonsRow />}
      bottomSection={<Summary />}
    />
  );
};

export default ModalBookDetails;
