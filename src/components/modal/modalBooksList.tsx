import React, { useCallback, useEffect, useState } from "react";
import { BooksListData } from "../../models/booksList";
import Modal, { ModalProps } from "./modal";
import { ThumbnailSize } from "../../consts/thumbnail";
import { Input } from "../input";
import { Add } from "../icons";
import BooksListList from "../booksList/booksListList";
import BooksListThumbnail from "../booksList/booksListThumbnail";
import useBooksList from "../../hooks/useBooksList";
import { Book, UserBook } from "../../models";
import useBook from "../../hooks/useBook";
import toast from "react-hot-toast";
import { DuplicateError } from "../../models/errors/duplicateError";
import BookDetails from "../book/bookDetails";
import { BookComponentProps } from "../search/BookSearchResult";
import { Logger } from "../../logger";
import SearchBar from "../search/searchBar";
import AddBookToList from "../booksList/addBookToList";
import { useFormik } from "formik";
import { TextArea } from "../textarea";

interface ModalBooksListProps {
  booksListData?: BooksListData;
  className?: string;
}

const ListName = ({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="h-full w-full flex justify-start">
    <input
      {...props}
      // className="text-xl font-extralight border-1 rounded-md w-full flex h-10 bg-background px-3 py-2 text-md placeholder:text-muted focus-visible:none truncate"
      // name="listName"
      // defaultValue={booksListData?.name}
      // onChange={formik.handleChange}
      // value={formik.values.listName}
      // key={booksListData?.listId}
      // placeholder="Awesome List Vol1"
    />
  </div>
);

const ModalBooksList: React.FC<ModalBooksListProps & ModalProps> = ({
  booksListData,
  className,
  ...modalProps
}) => {
  console.log("rendering ModalBooksList");
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

  const Thumbnail = React.useMemo(
    () => (
      <BooksListThumbnail
        books={booksListData?.booksInList?.map((bookInList) => bookInList.book)}
        thumbnailSize={ThumbnailSize.Large}
      />
    ),
    [booksListData?.booksInList]
  );

  return (
    <div className="flex flex-col">
      <Modal
        thumbnail={Thumbnail}
        thumbnailDetails={
          <ListName
            className="text-xl font-extralight border-1 rounded-md w-full flex h-10 bg-background px-3 py-2 text-md placeholder:text-muted focus-visible:none truncate"
            name="listName"
            defaultValue={booksListData?.name}
            onChange={formik.handleChange}
            value={formik.values.listName}
            key="list-name"
            placeholder="Awesome List Vol1"
          />
        }
        {...modalProps}
        backgroundColor={modalProps.backgroundColor || "#B1B1B1"}
      >
        <div className="w-full flex flex-row gap-2 justify-start items-center">
          <BooksListThumbnail
            onClick={() => setShowSearchBar(true)}
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
              value={formik.values.newBookComments}
              className="flex h-max border-1 rounded-md w-full bg-background px-3 py-2 text-md placeholder:text-muted focus-visible:none resize-none"
              rows={3}
              name="newBookComments"
              onChange={formik.handleChange}
              placeholder="Comment"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalBooksList;
