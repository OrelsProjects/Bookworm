import React, { useEffect, useState } from "react";
import { BooksListData } from "../../models/booksList";
import { ThumbnailSize } from "../../consts/thumbnail";
import { Input } from "../input";
import { Add } from "../icons";
import BooksListThumbnail from "../booksList/booksListThumbnail";
import useBooksList from "../../hooks/useBooksList";
import { Book } from "../../models";
import useBook from "../../hooks/useBook";
import toast from "react-hot-toast";
import { DuplicateError } from "../../models/errors/duplicateError";
import BookDetails from "../book/bookDetails";
import { BookComponentProps } from "../search/BookSearchResult";
import { Logger } from "../../logger";
import { useFormik } from "formik";
import { Books } from "../../models/book";
import { TextArea } from "../textarea";
import SearchBar from "../search/searchBar";
import { ModalContent } from "./modalContainers";
import BookList from "../book/bookList";

interface ModalBooksListProps {
  booksListData?: BooksListData;
}

const Thumbnail: React.FC<{ books?: Books }> = ({ books }) => (
  <BooksListThumbnail books={books} thumbnailSize={ThumbnailSize.Medium} />
);

const ListBooks: React.FC<{
  value: string;
  onChange: (e: any) => void;
  onAddNewBookClick: () => void;
  name: string;
  books?: Books;
  key?: string;
}> = ({ value, onChange, onAddNewBookClick, name, key, books }) => (
  <div className="w-full flex flex-row gap-2 justify-start items-center">
    {books && books.length > 0 && (
      <BookList
        books={books}
        direction="column"
        CustomBookComponent={({ book }) => (
          <BookDetails book={book} bookThumbnailSize={ThumbnailSize.Small} />
        )}
      />
    )}
    <BooksListThumbnail
      onClick={onAddNewBookClick}
      className="flex-shrink-0"
      Icon={
        <div className="absolute-center">
          <Add.Fill className="!text-background" />
        </div>
      }
      thumbnailSize={ThumbnailSize.Small}
    />

    <div className="w-full grid gap-2">
      <div className={`text-muted`}>Book Name</div>
      <TextArea
        value={value}
        rows={3}
        name={name}
        onChange={onChange}
        placeholder="Comment"
        key={key}
      />
    </div>
  </div>
);

const ModalBooksList: React.FC<ModalBooksListProps> = ({ booksListData }) => {
  const {
    createBooksList,
    addBookToList,
    loading: loadingList,
  } = useBooksList();
  const { addUserBook, getBookFullData, loading: loadingBook } = useBook();
  const [showSearchBar, setShowSearchBar] = useState(false);

  const formik = useFormik({
    initialValues: {
      listName: booksListData?.name ?? "",
      newBookComments: "",
    },
    onSubmit: (values) => {
      // Handle form submission using values.listName and values.newBookComments
      console.log(values);
    },
  });

  useEffect(() => {
    if (booksListData) {
      // setBooksComments(
      //   booksListData.booksInList?.map((bookInList) => ({
      //     bookId: bookInList.bookId,
      //     comments: bookInList.comments ?? "",
      //   })) ?? []
      // );
    }
  }, [booksListData]);

  const handleAddNewBookClick = async (book: Book, comments?: string) => {
    try {
      if (loadingList || loadingBook.current) return;

      let bookWithId = book;
      if (!book.bookId) {
        bookWithId = await toast.promise(
          (async () => {
            const userBook = await addUserBook(book);
            return (
              getBookFullData(userBook.bookId)?.bookData.book ?? {
                ...book,
                bookId: userBook.bookId,
              }
            );
          })(),
          {
            loading: "Adding new book...",
            success: "Book added successfully!",
            error: "Failed to add book.",
          }
        );
      }

      if (booksListData) {
        await toast.promise(addBookToList(booksListData.listId, bookWithId), {
          loading: "Adding book to list...",
          success: (book) => {
            return "Book added to list successfully!";
          },
          error: "Failed to add book to list.",
        });
      } else {
        await toast.promise(
          createBooksList({
            name: formik.values.listName,
            description: "",
            booksInList: [
              {
                bookId: bookWithId.bookId,
                comments: formik.values.newBookComments,
              },
            ],
          }),
          {
            loading: "Creating new list...",
            success: "New list created successfully!",
            error: (e) =>
              e instanceof DuplicateError
                ? "You already have a list with the same name 🤔"
                : "Failed to create list.",
          }
        );
      }
      setShowSearchBar(false);
    } catch (e: any) {
      Logger.error("Error adding book to list", {
        data: {
          book,
          newBookComments: formik.values.newBookComments,
        },
        error: e,
      });
    }
  };

  const SearchResult: React.FC<BookComponentProps> = ({ book }) => (
    <BookDetails
      book={book}
      bookThumbnailSize={ThumbnailSize.Medium}
      Icon={
        <Add.Outline
          className="w-8 h-8 flex-shrink-0"
          onClick={() => {
            handleAddNewBookClick(book);
          }}
        />
      }
    />
  );

  return (
    <ModalContent
      thumbnail={
        <Thumbnail
          books={booksListData?.booksInList?.map(
            (bookInList) => bookInList.book
          )}
        />
      }
      thumbnailDetails={
        <Input
          className="text-lg font-extralight border-1 rounded-md"
          defaultValue={booksListData?.name}
          name="listName"
          onChange={formik.handleChange}
          value={formik.values.listName}
          placeholder="Awesome List Vol1"
          key={booksListData?.listId}
        />
      }
      bottomSection={
        <div className="w-full h-full flex flex-col gap-2">
          <ListBooks
            value={formik.values.newBookComments}
            onChange={formik.handleChange}
            key={booksListData?.listId}
            onAddNewBookClick={() => setShowSearchBar(true)}
            name="newBookComments"
            books={booksListData?.booksInList?.map(
              (bookInList) => bookInList.book
            )}
          />
          {showSearchBar && <SearchBar CustomSearchItem={SearchResult} />}
        </div>
      }
    />
  );
};

export default ModalBooksList;
