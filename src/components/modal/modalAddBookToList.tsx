"use client";

import React from "react";

import Book from "../../models/book";
import useBook from "../../hooks/useBook";
import { UserBookData } from "../../models/userBook";
import BookThumbnail from "../book/bookThumbnail";
import { ModalProps } from "./modal";
import { ModalContent } from "./modalContainers";
import BookGeneralDetails from "./_components/bookGeneralDetails";
import useBooksList from "../../hooks/useBooksList";
import { BurgerLines } from "../icons";
import BooksListList from "../booksList/booksListList";
import { BooksListData } from "../../models/booksList";
import toast from "react-hot-toast";
import { isBooksEqual } from "../../utils/bookUtils";

type ModalBookDetailsProps = {
  book: Book;
} & ModalProps;

const ModalAddBookToList: React.FC<ModalBookDetailsProps> = ({
  book,
  ...modalProps
}) => {
  const { booksLists, addBookToList, removeBookFromList, loading } =
    useBooksList();
  const { getBookFullData, userBooksData } = useBook();

  const [bookData, setBookData] = React.useState<
    UserBookData | null | undefined
  >(null);

  React.useEffect(() => {
    const bookFullData = getBookFullData(book);
    setBookData(bookFullData);
  }, [userBooksData]);

  const handleAddBookToList = async (list: BooksListData) => {
    if (loading.current) {
      return;
    }
    const isBookInList = list.booksInList?.some((bookInList) =>
      isBooksEqual(book, bookInList.book)
    );
    const loadingMessage = isBookInList
      ? `Removing ${book.title} from list: ${list.name}...`
      : `Adding ${book.title} to list: ${list.name}...`;

    const successMessage = isBookInList
      ? `${book.title} removed from list: ${list.name}`
      : `${book.title} added to list: ${list.name}`;

    const errorMessage = isBookInList
      ? `Failed to remove ${book.title}`
      : `Failed to add ${book.title}`;

    await toast.promise(
      isBookInList
        ? removeBookFromList(list.listId, book.bookId)
        : addBookToList(list.listId, book),
      {
        loading: loadingMessage,
        success: successMessage,
        error: errorMessage,
      }
    );
  };

  const MyReadlists = () => (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-row gap-1 justify-start items-center">
        <BurgerLines.Fill iconSize="sm" className="!text-foreground" />
        <div className="text-xl font-bold">My Readlists</div>
      </div>
      <BooksListList
        booksListsData={booksLists}
        direction="column"
        endElementProps={{
          onEndElementClick: (list) => handleAddBookToList(list),
          book,
        }}
      />
    </div>
  );

  const Thumbnail = () => (
    <BookThumbnail
      src={book.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
      book={book}
      thumbnailSize="lg"
    />
  );

  return (
    <ModalContent
      thumbnail={<Thumbnail />}
      thumbnailDetails={
        bookData && <BookGeneralDetails userBookData={bookData} />
      }
      bottomSection={<MyReadlists />}
      {...modalProps}
    />
  );
};

export default ModalAddBookToList;
