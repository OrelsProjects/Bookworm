import React, { useEffect, useState } from "react";
import { BooksListData } from "../../models/booksList";
import { ThumbnailSize } from "../../consts/thumbnail";
import { Input } from "../input";
import { Add, Cancel, Checkmark } from "../icons";
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
import { BookInList, BookInListWithBook } from "../../models/bookInList";
import BookThumbnail from "../book/bookThumbnail";
import { ListDiv, OpacityDiv } from "../animationDivs";

interface ModalBooksListProps {
  booksListData?: BooksListData;
}

interface ListBookAndBookDetailsProps {
  onAddNewBookClick: () => void;
  onDeleteBookClick: (bookInList: BookInList) => void;
  onChange: (
    bookInListWithBook: BookInListWithBook | null | undefined,
    comment: string
  ) => void;
  value: string;
  name: string;
  key?: string;
}

interface ListBookProps extends ListBookAndBookDetailsProps {
  booksInList?: BookInListWithBook[];
}

interface BookInListDetailsProps extends ListBookAndBookDetailsProps {
  bookInList?: BookInListWithBook;
}

const Thumbnail: React.FC<{ books?: Books }> = ({ books }) => (
  <BooksListThumbnail books={books} thumbnailSize={ThumbnailSize.Medium} />
);

const BookInListDetails: React.FC<BookInListDetailsProps> = ({
  bookInList,
  onAddNewBookClick,
  onDeleteBookClick,
  onChange,
  value,
  name,
  key,
}) => {
  const [comment, setComment] = useState("");

  useEffect(() => {
    setComment(bookInList?.comments ?? "");
  }, [value]);

  return (
    <div className="w-full flex flex-row gap-2">
      <BookThumbnail
        book={bookInList?.book}
        className="flex-shrink-0"
        Icon={
          <div className="absolute-center overflow-hidden rounded-full">
            {bookInList?.book ? (
              <Cancel.Fill
                className="!text-background !bg-foreground -m-1 border-none rounded-full"
                size="md"
                key={`delete-book-${bookInList.book.bookId}`}
                onClick={() => onDeleteBookClick(bookInList)}
              />
            ) : (
              <Add.Fill className="!text-background" size="md" />
            )}
          </div>
        }
        thumbnailSize={ThumbnailSize.Small}
      />

      <div className="w-full h-full flex flex-col justify-start items-start gap-2">
        <div
          className={`${
            bookInList ? "text-foreground" : "text-muted"
          } h-fit line-clamp-1`}
        >
          {bookInList?.book?.title ?? "Book Name"}
        </div>
        <TextArea
          value={comment}
          rows={3}
          name={name}
          onChange={(e) => {
            const value = e.target.value;
            setComment(value);
            onChange(bookInList, value);
          }}
          placeholder="Comment"
          key={key}
        />
      </div>
    </div>
  );
};

const ListBooks: React.FC<ListBookProps> = ({
  value,
  onChange,
  onAddNewBookClick,
  onDeleteBookClick,
  name,
  key,
  booksInList,
}) => (
  <div key={key ?? "modal-books-list-books"}>
    <div className="w-full flex flex-col gap-2 justify-center items-start">
      {booksInList?.map((bookInList) => (
        <BookInListDetails
          key={key}
          bookInList={bookInList}
          onAddNewBookClick={onAddNewBookClick}
          onDeleteBookClick={onDeleteBookClick}
          onChange={onChange}
          value={value}
          name={name}
        />
      ))}
      <div className="w-full flex flex-row gap-2">
        <BooksListThumbnail
          className="flex-shrink-0"
          Icon={
            <div className="absolute-center">
              <Add.Fill
                className="!text-background"
                size="md"
                onClick={onAddNewBookClick}
              />
            </div>
          }
          thumbnailSize={ThumbnailSize.Small}
        />

        <div className="w-full h-full flex flex-col justify-start items-start gap-2">
          <div className={`text-muted h-fit`}>Book Name</div>
          <TextArea
            value={value}
            rows={3}
            name={name}
            onChange={(e) => {
              onChange(null, e.target.value);
            }}
            placeholder="Comment"
            key={key}
          />
        </div>
      </div>
    </div>
  </div>
);

const ModalBooksList: React.FC<ModalBooksListProps> = ({ booksListData }) => {
  const {
    createBooksList,
    addBookToList,
    removeBookFromList,
    loading: loadingList,
  } = useBooksList();
  const { addUserBook, getBookFullData, loading: loadingBook } = useBook();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [currentBooksList, setCurrentBookList] = useState<
    BooksListData | undefined
  >();

  const buildFormikValueName = (bookId: number) => `newBookComments-${bookId}`;

  const formik = useFormik({
    initialValues: {
      listName: booksListData?.name ?? "",
      newBookComments: "",
    },
    onSubmit: (values) => {},
  });

  useEffect(() => {
    setCurrentBookList(booksListData);
    booksListData?.booksInList?.forEach((bookInList) => {
      formik.setFieldValue(
        buildFormikValueName(bookInList.bookId),
        bookInList.comments
      );
    });
  }, [booksListData]);

  const isBookInList = (book: Book) =>
    currentBooksList?.booksInList?.some(
      (bookInList) => bookInList.bookId === book.bookId
    );

  const handleDeleteBookClick = async (bookInList: BookInList) => {
    try {
      if (loadingList.current || loadingBook.current) return;
      if (!currentBooksList) return;

      await toast.promise(
        removeBookFromList(currentBooksList.listId, bookInList.bookId),
        {
          loading: `Removing book from list...`,
          success: `book removed from list successfully!`,
          error: `Failed to remove book from list.`,
        }
      );
      const newBooksInList = currentBooksList.booksInList?.filter(
        (book) => book.bookId !== bookInList.bookId
      );

      setCurrentBookList({
        ...currentBooksList,
        booksInList: newBooksInList,
      });
    } catch (e: any) {
      Logger.error("Error removing book from list", {
        data: {
          bookInList,
        },
        error: e,
      });
    }
  };

  const handleAddNewBookClick = async (book: Book) => {
    try {
      if (loadingList.current || loadingBook.current) return;

      if (!formik.values.listName) {
        formik.setFieldError("listName", "List name is required");
        return;
      }
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

      if (currentBooksList) {
        await toast.promise(
          addBookToList(currentBooksList.listId, bookWithId),
          {
            loading: `Adding ${book.title} to list...`,
            success: `${book.title} added to list successfully!`,
            error: `Failed to add ${book.title} to list.`,
          }
        );

        const bookInList: BookInListWithBook = {
          bookId: bookWithId.bookId,
          listId: currentBooksList.listId,
          comments: formik.values.newBookComments,
          book: bookWithId,
        };
        const newBooksInList = [...(currentBooksList.booksInList ?? [])];
        newBooksInList.push(bookInList);
        setCurrentBookList({
          ...currentBooksList,
          booksInList: newBooksInList,
        });
      } else {
        const createBooksListResponse = await toast.promise(
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
        setCurrentBookList(createBooksListResponse);
      }
      setShowSearchBar(false);
      formik.setFieldValue("newBookComments", "");
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
        isBookInList(book) ? (
          <Checkmark.Fill className="flex-shrink-0" size="md" />
        ) : (
          <Add.Outline
            className="flex-shrink-0"
            size="md"
            onClick={() => {
              handleAddNewBookClick(book);
            }}
          />
        )
      }
    />
  );

  return (
    <ModalContent
      thumbnail={
        <Thumbnail
          books={currentBooksList?.booksInList?.map(
            (bookInList) => bookInList.book
          )}
        />
      }
      thumbnailDetails={
        <Input
          className="text-lg font-extralight border-1 rounded-md"
          defaultValue={currentBooksList?.name}
          name="listName"
          onChange={formik.handleChange}
          value={formik.values.listName}
          placeholder="Awesome List Vol1"
          key={currentBooksList?.listId}
          error={formik.errors.listName}
        />
      }
      bottomSection={
        <div
          className="w-full h-full flex flex-col gap-2 overflow-auto scrollbar-hide"
          key="modal-books-list"
        >
          <div className="flex flex-col gap-2">
            <ListBooks
              value={formik.values.newBookComments}
              onDeleteBookClick={(bookInList) => {
                handleDeleteBookClick(bookInList);
              }}
              onChange={(bookInList, comment) => {
                if (!bookInList) {
                  formik.setFieldValue("newBookComments", comment);
                } else if (bookInList?.book) {
                  formik.setFieldValue(
                    buildFormikValueName(bookInList.book.bookId),
                    comment
                  );
                }
              }}
              key={currentBooksList?.listId}
              onAddNewBookClick={() => {
                setShowSearchBar(true);
              }}
              name="newBookComments"
              booksInList={currentBooksList?.booksInList?.map(
                (bookInList) => bookInList
              )}
            />
            {showSearchBar && (
              <OpacityDiv key="modal-books-list-search-bar">
                <SearchBar CustomSearchItem={SearchResult} />
              </OpacityDiv>
            )}
          </div>
        </div>
      }
    ></ModalContent>
  );
};

export default ModalBooksList;
