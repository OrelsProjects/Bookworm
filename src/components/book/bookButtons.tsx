import React, { useMemo } from "react";
import { CiCirclePlus as Plus } from "react-icons/ci";
import { CiBookmark as Bookmark } from "react-icons/ci";
import { IoBookmark as BookmarkFill } from "react-icons/io5";
import { IoCheckmarkCircle as CheckmarkFill } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

import { Book, UserBookData } from "../../models";
import useBook from "../../hooks/useBook";
import {
  ReadingStatusEnum,
  readingStatusToName,
} from "../../models/readingStatus";
import { increaseLuminosity } from "../../utils/thumbnailUtils";
import toast from "react-hot-toast";
import { IconSize, getIconSize } from "../../consts/icon";
import { useModal } from "../../hooks/useModal";
import { ErrorUnauthenticated } from "../../models/errors/unauthenticatedError";
import { IconType } from "react-icons";

type BookButtonsProps = {
  book: Book;
  iconSize: IconSize;
  className?: string;
  showAddToListButton?: boolean;
  classNameIcon?: string;
};

type ButtonImageProps = {
  title: string;
  Icon: IconType;
  iconSize?: IconSize;
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
  onClick,
  iconSize = "sm",
  selected,
  className = "",
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
      className={`flex flex-col justify-center items-center gap-2 ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <Icon
        style={{
          height: getIconSize({ size: iconSize }).heightPx,
          width: getIconSize({ size: iconSize }).widthPx,
        }}
        className={`${selected ? "!text-primary" : "!text-foreground"}
          `}
      />
      <div className={`text-foreground text-lg`}>{title}</div>
    </div>
  );
};

export const BookButtons = () => {
  const {
    getBookFullData,
    updateBookReadingStatus,
    addUserBook,
    loading,
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
          <div
            className={`flex flex-col justify-center items-center gap-2 w-1/3 ${className}`}
            onClick={() =>
              handleUpdateBookReadingStatus(
                ReadingStatusEnum.READ,
                book,
                userBookData
              )
            }
          >
            <div
              className={`rounded-full ${
                getIconSize({ size: iconSize }).className
              } ${isBookRead ? "bg-primary" : "border-1"}
              flex justify-center items-center"
              `}
            >
              <FaCheck
                style={{
                  height: getIconSize({ size: iconSize }).heightPx,
                  width: getIconSize({ size: iconSize }).widthPx,
                  padding: 5,
                }}
                className={`!text-primary ${
                  isBookRead ? "fill-background" : "fill-foreground"
                } `}
              />
            </div>
            <div className={`text-foreground text-lg`}>Read</div>
          </div>
          // <ButtonImage
          //   title="Read"
          //   Icon={isBookRead ? CheckmarkFill : FaCheck}
          //   iconSize={iconSize}
          //   selected={isBookRead}
          //   className="w-1/3"
          //   onClick={() =>
          //     handleUpdateBookReadingStatus(
          //       ReadingStatusEnum.READ,
          //       book,
          //       userBookData
          //     )
          //   }
          // />
        )}

        {book && (
          <ButtonImage
            title="To Read"
            Icon={isBookToRead ? BookmarkFill : Bookmark}
            iconSize={iconSize}
            selected={isBookToRead}
            className="w-1/3"
            onClick={() =>
              handleUpdateBookReadingStatus(
                ReadingStatusEnum.TO_READ,
                book,
                userBookData
              )
            }
          />
        )}
        {showAddToListButton && (
          <ButtonImage
            title={"Add to list"}
            Icon={Plus}
            iconSize={iconSize}
            className={"w-1/3"}
            selected={false}
            buttonsColor={buttonsColor}
            onClick={() => handleAddBookToList(book)}
          />
        )}
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
