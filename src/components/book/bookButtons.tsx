import React, { useEffect, useMemo } from "react";
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
import { IconSize } from "../../consts/icon";
import { useDispatch } from "react-redux";
import { ModalTypes, showModal } from "../../lib/features/modal/modalSlice";

type BookButtonsProps = {
  book: Book;
  iconSize: IconSize;
  className?: string;
  showAddToListButton?: boolean;
  classNameIcon?: string;
};

type ButtonImageProps = {
  title: string;
  Icon: React.ElementType;
  iconSize?: IconSize;
  selected: boolean;
  width?: number;
  height?: number;
  onClick?: () => void;
  className?: string;
  buttonsColor?: string;
  classNameIcon?: string;
};

export const ButtonImage: React.FC<ButtonImageProps> = ({
  title,
  Icon,
  onClick,
  buttonsColor,
  iconSize = "sm",
  selected,
  width = 35,
  height = 35,
  classNameIcon = "",
}) => {
  const textSize = useMemo(() => {
    switch (iconSize) {
      case "xs":
        return "text-sm font-light";
      case "sm":
        return "text-sm";
      case "md":
        return "text-md";
      case "lg":
        return "text-lg";
      default:
        return "text-sm";
    }
  }, [iconSize]);

  return (
    <div
      className={`flex flex-col justify-center items-center gap-2 ${classNameIcon}`}
      onClick={onClick}
    >
      <Icon
        style={{
          height,
          width,
          fill: selected ? buttonsColor : "currentColor",
        }}
        iconSize={iconSize}
        className={`${selected ? "" : "!text-foreground"}`}
      />
      <div className={`text-foreground ${textSize}`}>{title}</div>
    </div>
  );
};

export const BookButtons: React.FC<BookButtonsProps> = ({
  book,
  iconSize,
  className,
  showAddToListButton = true,
  classNameIcon = "",
}) => {
  const dispatch = useDispatch();
  const { getBookFullData, updateBookReadingStatus, loading, userBooksData } =
    useBook();
  const [bookData, setBookData] = React.useState<UserBookData | undefined>();
  const [bookRead, setBookRead] = React.useState(false);
  const buttonsColor = increaseLuminosity(book?.thumbnailColor);

  const handleUpdateBookReadingStatus = async (status: ReadingStatusEnum) => {
    if (!bookData || loading.current) return;
    if (
      bookData?.userBook?.readingStatusId &&
      bookData?.userBook?.readingStatusId === status
    ) {
      return;
    }
    const readingStatusName = readingStatusToName(status);
    await toast.promise(updateBookReadingStatus(bookData?.userBook, status), {
      loading: `Adding ${book?.title} to list: ${readingStatusName}...`,
      success: `${book?.title} added to list: ${readingStatusName}`,
      error: `Failed to add ${book?.title} to list: ${readingStatusName}`,
    });
  };

  const handleAddBookToList = () => {
    dispatch(showModal({ data: book, type: ModalTypes.ADD_BOOK_TO_LIST }));
  };

  useEffect(() => {
    if (!book) return;
    const userBookData = getBookFullData(book) ?? undefined;
    setBookData(userBookData);
    setBookRead(isBookRead(userBookData?.userBook));
  }, [book, userBooksData]);

  return (
    <div
      className={`h-full w-full flex flex-row justify-evenly items-center gap-4 ${className}`}
    >
      {book &&
        ButtonImage({
          title: "Read",
          Icon: bookRead ? Checkmark.Fill : Add.Fill,
          iconSize,
          selected: bookRead,
          buttonsColor,
          onClick: () => handleUpdateBookReadingStatus(ReadingStatusEnum.READ),
          classNameIcon,
        })}
      {book &&
        ButtonImage({
          title: "To Read",
          Icon: Bookmark.Fill,
          iconSize,
          selected: !bookRead && !!bookData,
          width: 24,
          buttonsColor,
          onClick: () =>
            handleUpdateBookReadingStatus(ReadingStatusEnum.TO_READ),
          classNameIcon,
        })}
      {bookRead &&
        showAddToListButton &&
        ButtonImage({
          title: "Add to list",
          Icon: Add.Outline,
          iconSize,
          selected: false,
          buttonsColor,
          onClick: () => handleAddBookToList(),
          classNameIcon,
        })}
    </div>
  );
};

export default BookButtons;
