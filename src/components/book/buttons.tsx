import React, { useEffect } from "react";
import { Add, Bookmark, Checkmark } from "../icons";
import { Book, UserBookData } from "../../models";
import useBook from "../../hooks/useBook";
import { isBookRead } from "../../models/userBook";
import { ReadingStatusEnum } from "../../models/readingStatus";
import { increaseLuminosity } from "../../utils/thumbnailUtils";

type BookButtonsProps = {
  book?: Book;
};

type ButtionImageProps = {
  title: string;
  Icon: React.ElementType;
  selected: boolean;
  width?: number;
  height?: number;
  onClick?: () => void;
};

const BookButtons: React.FC<BookButtonsProps> = ({ book }) => {
  const { getBookFullData, updateBookReadingStatus } = useBook();
  const [bookData, setBookData] = React.useState<UserBookData | undefined>();
  const [bookRead, setBookRead] = React.useState(false);
  const buttonsColor = increaseLuminosity(book?.thumbnailColor);

  useEffect(() => {
    const userBookData = getBookFullData(book) ?? undefined;
    setBookData(userBookData);
    setBookRead(isBookRead(userBookData?.userBook));
  }, [book]);

  const ButtonImage: React.FC<ButtionImageProps> = ({
    title,
    Icon,
    selected,
    width = 35,
    height = 35,
    onClick,
  }) => (
    <div
      className={`flex flex-col justify-center items-center gap-2`}
      onClick={onClick}
    >
      <Icon
        style={{
          height,
          width,
          fill: selected ? buttonsColor : "currentColor",
        }}
        className={`${selected ? "" : "!text-foreground"}`}
      />
      <div className="text-foreground text-lg">{title}</div>
    </div>
  );

  return (
    <div className="h-24 w-full flex flex-row justify-evenly items-center gap-4">
      {bookData &&
        ButtonImage({
          title: "Read",
          Icon: bookRead ? Checkmark.Fill : Add.Fill,
          selected: bookRead,
          onClick: () =>
            updateBookReadingStatus(bookData.userBook, ReadingStatusEnum.READ),
        })}
      {bookData &&
        ButtonImage({
          title: "To Read",
          Icon: Bookmark.Fill,
          selected: !bookRead,
          width: 24,
          onClick: () =>
            updateBookReadingStatus(
              bookData.userBook,
              ReadingStatusEnum.TO_READ
            ),
        })}
      {bookRead &&
        ButtonImage({
          title: "Add to list",
          Icon: Add.Outline,
          selected: false,
        })}
    </div>
  );
};

export default BookButtons;
