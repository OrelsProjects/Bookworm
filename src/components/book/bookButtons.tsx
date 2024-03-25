import React, { useMemo } from "react";
import { CiCirclePlus as Plus } from "react-icons/ci";
import { CiBookmark as Bookmark } from "react-icons/ci";
import { IoBookmark as BookmarkFill } from "react-icons/io5";
import { IoCheckmarkCircleOutline as Checkmark } from "react-icons/io5";
import { IoCheckmarkCircle as CheckmarkFill } from "react-icons/io5";

import { Book, UserBookData } from "../../models";
import useBook from "../../hooks/useBook";
import {
  ReadingStatusEnum,
  readingStatusToName,
} from "../../models/readingStatus";
import { increaseLuminosity } from "../../utils/thumbnailUtils";
import toast from "react-hot-toast";
import { IconSize } from "../../consts/icon";
import { useModal } from "../../hooks/useModal";
import { ErrorUnauthenticated } from "../../models/errors/unauthenticatedError";

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
  iconClassName?: string;
};

const ButtonImage: React.FC<ButtonImageProps> = ({
  title,
  Icon,
  onClick,
  buttonsColor,
  iconSize = "sm",
  selected,
  width = 35,
  height = 35,
  iconClassName = "",
}) => {
  const textSize = {
    xs: "text-sm font-light",
    sm: "text-lg",
    md: "text-lg",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div
      className={`flex flex-col justify-center items-center gap-2`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <Icon
        style={{
          height,
          width,
        }}
        iconSize={iconSize}
        className={`${
          selected ? "!text-primary" : "!text-foreground"
        } ${iconClassName}`}
      />
      <div className={`text-foreground ${textSize[iconSize]}`}>{title}</div>
    </div>
  );
};

export const BookButtons = () => {
  const {
    getBookFullData,
    updateBookReadingStatus,
    addUserBook,
    loading,
    userBooksData,
    deleteUserBook,
  } = useBook();
  const { showAddBookToListModal } = useModal();

  const handleUpdateBookReadingStatus = async (
    status: ReadingStatusEnum,
    book: Book,
    userBookData?: UserBookData | null
  ) => {
    if (loading.current) return;
    let promise: Promise<any> | undefined = undefined;
    let loadingMessage = "";
    let successMessage = "";
    let errorMessage = "";
    const readingStatusName = readingStatusToName(status);
    if (
      userBookData?.userBook?.readingStatusId &&
      userBookData?.userBook?.readingStatusId === status
    ) {
      promise = deleteUserBook(userBookData.userBook);
      loadingMessage = `Removing ${book?.title} from list ${readingStatusName}...`;
      successMessage = `${book?.title} removed from list ${readingStatusName}`;
      errorMessage = `Failed to remove ${book?.title} from list ${readingStatusName}`;
    } else {
      if (!userBookData) {
        promise = addUserBook({
          book,
          readingStatusId: status as number,
        });
      } else {
        promise = updateBookReadingStatus(userBookData.userBook, status);
      }
      loadingMessage = `Adding ${book?.title} to list: ${readingStatusName}...`;
      successMessage = `${book?.title} updated to list: ${readingStatusName}`;
      errorMessage = `Failed to add ${book?.title} to list: ${readingStatusName}`;
    }
    let toastId = toast.loading(loadingMessage);
    try {
      await promise;
      toast.success(successMessage);
    } catch (e) {
      if (!(e instanceof ErrorUnauthenticated)) {
        toast.error(errorMessage);
      }
    } finally {
      toast.dismiss(toastId);
    }
  };

  const updateBookStatusToRead = async (
    book: Book,
    userBookData?: UserBookData | null
  ) =>
    handleUpdateBookReadingStatus(ReadingStatusEnum.READ, book, userBookData);

  const updateBookStatusToToRead = async (
    book: Book,
    userBookData?: UserBookData | null
  ) =>
    handleUpdateBookReadingStatus(
      ReadingStatusEnum.TO_READ,
      book,
      userBookData
    );

  const handleAddBookToList = (book: Book) => showAddBookToListModal(book);

  const Buttons: React.FC<BookButtonsProps> = ({
    book,
    iconSize,
    className,
    showAddToListButton = true,
    classNameIcon = "",
  }) => {
    const buttonsColor = increaseLuminosity(book?.thumbnailColor);

    const isBookRead = useMemo(() => {
      const bookData = getBookFullData(book);
      return bookData?.userBook.readingStatusId === ReadingStatusEnum.READ;
    }, [book, getBookFullData]);

    const isBookToRead = useMemo(() => {
      const bookData = getBookFullData(book);
      return bookData?.userBook.readingStatusId === ReadingStatusEnum.TO_READ;
    }, [book, getBookFullData]);

    const userBookData = useMemo(
      () => getBookFullData(book),
      [book, getBookFullData]
    );

    return (
      <div
        className={`h-fit w-full flex flex-row justify-evenly items-center gap-4 ${className}`}
      >
        {book && (
          <ButtonImage
            title="Read"
            Icon={isBookRead ? CheckmarkFill : Checkmark}
            iconSize={iconSize}
            selected={isBookRead}
            onClick={() =>
              handleUpdateBookReadingStatus(
                ReadingStatusEnum.READ,
                book,
                userBookData
              )
            }
          />
        )}

        {book && (
          <ButtonImage
            title="To Read"
            Icon={isBookToRead ? BookmarkFill : Bookmark}
            iconSize="lg"
            selected={isBookToRead}
            onClick={() =>
              handleUpdateBookReadingStatus(
                ReadingStatusEnum.TO_READ,
                book,
                userBookData
              )
            }
            iconClassName="ml-2"
          />
        )}
        {showAddToListButton &&
          ButtonImage({
            title: "Add to list",
            Icon: Plus,
            iconSize: "sm",
            selected: false,
            buttonsColor,
            onClick: () => handleAddBookToList(book),
            iconClassName: classNameIcon,
          })}
      </div>
    );
  };
  return {
    Buttons,
    handleAddBookToList,
    updateBookStatusToRead,
    updateBookStatusToToRead,
  };
};

export default BookButtons;
