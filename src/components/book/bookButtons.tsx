import React, { useEffect } from "react";
import { Add } from "../icons/add";
import { Bookmark } from "../icons/bookmark";
import { Checkmark } from "../icons/checkmark";

import { Book, UserBookData } from "../../models";
import useBook from "../../hooks/useBook";
import { isBookRead } from "../../models/userBook";
import {
  ReadingStatusEnum,
  readingStatusToName,
} from "../../models/readingStatus";
import { increaseLuminosity } from "../../utils/thumbnailUtils";
import toast from "react-hot-toast";
import { IconSize, getIconSize } from "../../consts/icon";
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
          fill: selected ? buttonsColor : "currentColor",
        }}
        iconSize={iconSize}
        iconClassName={iconClassName}
        className={`${selected ? "" : "!text-foreground"}`}
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
    try {
      await toast.promise(promise, {
        loading: loadingMessage,
        success: successMessage,
        error: (e: any) => {
          if (e instanceof ErrorUnauthenticated) {
            return "You need to be logged in";
          }
          return errorMessage;
        },
      });
    } catch (e) {}
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
    const [userBookData, setUserBookData] = React.useState<
      UserBookData | undefined
    >();
    const [bookRead, setBookRead] = React.useState(false);

    useEffect(() => {
      if (!book) return;
      const userBookData = getBookFullData(book) ?? undefined;
      setUserBookData(userBookData);
      setBookRead(isBookRead(userBookData?.userBook));
    }, [book, userBooksData]);

    return (
      <div
        className={`h-fit w-full flex flex-row justify-evenly items-center gap-4 ${className}`}
      >
        {book && (
          <div
            className="flex flex-col justify-center items-center gap-2"
            onClick={() =>
              handleUpdateBookReadingStatus(
                ReadingStatusEnum.READ,
                book,
                userBookData
              )
            }
          >
            {Checkmark.Default && (
              <Checkmark.Default
                style={{
                  height: getIconSize({ size: "md" }).heightPx,
                  width: getIconSize({ size: "md" }).widthPx,
                  fill: bookRead ? "primary" : "currentColor",
                }}
                className={`rounded-full p-1 text-background ${
                  bookRead ? buttonsColor : "bg-foreground"
                }`}
              />
            )}
            <div className={`text-foreground text-lg`}>Read</div>
          </div>
        )}
        {book &&
          ButtonImage({
            title: "To Read",
            Icon: Bookmark.Fill,
            iconSize: "md",
            selected: !bookRead && !!userBookData,
            width: 24,
            buttonsColor,
            onClick: () =>
              handleUpdateBookReadingStatus(
                ReadingStatusEnum.TO_READ,
                book,
                userBookData
              ),
            iconClassName: classNameIcon,
          })}
        {showAddToListButton &&
          ButtonImage({
            title: "Add to list",
            Icon: Add.Outline,
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
