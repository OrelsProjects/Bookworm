import React, { useEffect } from "react";
import { Add, Bookmark, Checkmark } from "../icons";
import { Book, UserBookData } from "../../models";
import useBook from "../../hooks/useBook";
import { isBookRead } from "../../models/userBook";
import {
  ReadingStatusEnum,
  readingStatusToName,
} from "../../models/readingStatus";
import { increaseLuminosity } from "../../utils/thumbnailUtils";
import toast from "react-hot-toast";

type BookButtonsProps = {
  book: Book;
  className?: string;
};

type ButtonImageProps = {
  title: string;
  Icon: React.ElementType;
  selected: boolean;
  width?: number;
  height?: number;
  onClick?: () => void;
  className?: string;
  buttonsColor?: string;
};

const ButtonImage: React.FC<ButtonImageProps> = ({
  title,
  Icon,
  selected,
  width = 35,
  height = 35,
  onClick,
  buttonsColor,
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

const BookButtons: React.FC<BookButtonsProps> = ({ book, className }) => {
  const { getBookFullData, updateBookReadingStatus, loading } = useBook();
  const [bookData, setBookData] = React.useState<UserBookData | undefined>();
  const [bookRead, setBookRead] = React.useState(false);
  const buttonsColor = increaseLuminosity(book?.thumbnailColor);

  const handleUpdateBookReadingStatus = async (status: ReadingStatusEnum) => {
    if (!bookData || loading.current) return;
    const readingStatusName = readingStatusToName(status);
    await toast.promise(updateBookReadingStatus(bookData?.userBook, status), {
      loading: `Adding ${book?.title} to list: ${readingStatusName}...`,
      success: `${book?.title} added to list: ${readingStatusName}`,
      error: `Failed to add ${book?.title} to list: ${readingStatusName}`,
    });
  };

  useEffect(() => {
    if (!book) return;
    const userBookData = getBookFullData(book) ?? undefined;
    setBookData(userBookData);
    setBookRead(isBookRead(userBookData?.userBook));
  }, [book]);

  return (
    <div
      className={`h-full w-full flex flex-row justify-evenly items-center gap-4 ${className}`}
    >
      {book &&
        ButtonImage({
          title: "Read",
          Icon: bookRead ? Checkmark.Fill : Add.Fill,
          selected: bookRead,
          buttonsColor,
          onClick: () => handleUpdateBookReadingStatus(ReadingStatusEnum.READ),
        })}
      {book &&
        ButtonImage({
          title: "To Read",
          Icon: Bookmark.Fill,
          selected: !bookRead && !!bookData,
          width: 24,
          buttonsColor,
          onClick: () =>
            handleUpdateBookReadingStatus(ReadingStatusEnum.TO_READ),
        })}
      {bookRead &&
        ButtonImage({
          title: "Add to list",
          Icon: Add.Outline,
          selected: false,
          buttonsColor,
        })}
    </div>
  );
};

export default BookButtons;
