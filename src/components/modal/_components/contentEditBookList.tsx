"use client";
import { useFormik } from "formik";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { BookInList, BookInListWithBook } from "../../../models/bookInList";
import { BooksListData } from "../../../models/booksList";
import BookDetails from "../../book/bookDetails";
import { Add } from "../../icons/add";
import { Checkmark } from "../../icons/checkmark";
import { BookComponentProps } from "../../search/BookSearchResult";
import SearchBar from "../../search/searchBar";
import SearchBarIcon from "../../search/searchBarIcon";
import BookDetailsSkeleton from "../../skeletons/BookDetailsSkeleton";
import useBook from "../../../hooks/useBook";
import { useRouter } from "next/navigation";
import { Book } from "../../../models";
import { DuplicateError } from "../../../models/errors/duplicateError";
import useBooksList from "../../../hooks/useBooksList";
import { Logger } from "../../../logger";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import BooksListThumbnail from "../../booksList/booksListThumbnail";
import { TextArea } from "../../ui/textarea";
import BookThumbnail from "../../book/bookThumbnail";
import { Cancel } from "../../icons/cancel";
import GripLines from "../../icons/gripLines";
import { CommentsArea } from "./commentsArea";
import { buildFormikValueName } from "../modalBooksListEdit";
import { useSelector } from "react-redux";
import { selectBooksLists } from "../../../lib/features/booksLists/booksListsSlice";

interface ListBookAndBookDetailsProps {
  onAddNewBookClick?: () => void;
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
  onPositionChange: (booksInListWithBook: BookInListWithBook[]) => void;
}

interface BookInListDetailsProps extends ListBookAndBookDetailsProps {
  bookInList?: BookInListWithBook;
  position: number;
}

const BookInListDetails: React.FC<BookInListDetailsProps> = ({
  bookInList,
  onDeleteBookClick,
  name,
  key,
  position,
}) => {
  return (
    <div className="w-full flex flex-row gap-2 justify-start items-start relative">
      <div className="flex flex-col justify-center items-center text-sm absolute -left-6 top-1/3">
        <div className="">#{position}</div>
        <GripLines className="!text-foreground w-4 h-4" />
      </div>
      <BookThumbnail
        book={bookInList?.book}
        className="flex-shrink-0"
        Icon={
          <div className="absolute-center overflow-hidden rounded-full">
            {bookInList?.book ? (
              <Cancel.Fill
                className="!text-foreground !bg-background border-none rounded-full p-1"
                iconSize="md"
                key={`delete-book-${bookInList.book.bookId}`}
                onClick={() => onDeleteBookClick(bookInList)}
              />
            ) : (
              <Add.Outline iconClassName="!text-foreground" iconSize="md" />
            )}
          </div>
        }
        thumbnailSize="md"
      />

      <div className="w-full h-full flex flex-col justify-start items-start gap-2">
        <div
          className={`${
            bookInList ? "text-foreground" : "text-muted"
          } h-fit line-clamp-1`}
        >
          {bookInList?.book?.title ?? "Book Name"}
        </div>
        <CommentsArea key={key} name={name} bookInList={bookInList} />
      </div>
    </div>
  );
};

const ListBooks: React.FC<ListBookProps> = ({
  value,
  onChange,
  onPositionChange,
  onAddNewBookClick,
  onDeleteBookClick,
  name,
  booksInList,
}) => {
  return (
    <div className="w-full flex flex-col gap-2 justify-center items-start">
      <DragDropContext
        onDragEnd={(result: DropResult) => {
          const draggedBookInList = booksInList?.[result.source.index];
          const destinationIndex = result.destination?.index;
          if (!draggedBookInList) return;
          if (destinationIndex === undefined) return;
          if (destinationIndex === result.source.index) return;

          // Set the new position of the dragged book and all the books after it
          const newBooksInList = [...booksInList];
          // Remove the dragged book from the list
          newBooksInList.splice(result.source.index, 1);
          // Add the dragged book to the new position
          newBooksInList.splice(destinationIndex, 0, draggedBookInList);
          const booksListWithUpdatedIndexes = newBooksInList.map(
            (bookInList, index) => ({
              ...bookInList,
              position: index,
            })
          );
          onPositionChange(booksListWithUpdatedIndexes);
        }}
      >
        <Droppable droppableId="droppable-books-in-list">
          {(provided) => (
            <ul
              className="w-full flex flex-col justify-center items-start gap-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {booksInList?.map((bookInList, index) => (
                <Draggable
                  key={`draggable-id-book-in-modal-books-list-${bookInList.bookId}`}
                  draggableId={`draggable-id-book-in-modal-books-list-${bookInList.bookId}`}
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="w-full"
                    >
                      <BookInListDetails
                        bookInList={bookInList}
                        onAddNewBookClick={onAddNewBookClick}
                        onDeleteBookClick={onDeleteBookClick}
                        onChange={onChange}
                        value={value}
                        name={`${name}-${bookInList.bookId}`}
                        position={index + 1}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div className="w-full flex flex-row gap-2">
        <BooksListThumbnail
          className="flex-shrink-0"
          Icon={
            <div className="absolute-center">
              <Add.Fill
                className="!text-foreground !bg-background border-none rounded-full p-1"
                iconSize="md"
                onClick={onAddNewBookClick}
              />
            </div>
          }
          thumbnailSize="md"
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
            key={`books-in-list-book-name`}
          />
        </div>
      </div>
    </div>
  );
};

const ContentEditBookList = ({
  listName,
  booksListId,
  newListDescription,
}: {
  listName: string;
  booksListId: string;
  newListDescription: string;
}) => {
  const router = useRouter();
  const { booksListsData } = useSelector(selectBooksLists);
  const {
    createBooksList,
    addBookToList,
    removeBookFromList,
    updateBooksInListPositions,
    loading: loadingList,
  } = useBooksList();
  const { addBook, getBookFullData, loading: loadingBook } = useBook();
  const [currentBooksList, setCurrentBookList] = useState<
    BooksListData | undefined
  >();
  const [isSearchBarScrolledIntoView, setIsSearchBarScrolledIntoView] =
    useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const formik = useFormik({
    initialValues: {
      newBookComments: "",
    },
    onSubmit: (values) => {},
  });

  useEffect(() => {
    const booksListData = booksListsData.find(
      (booksList) => booksList.listId === booksListId
    );
    setCurrentBookList(booksListData);
    booksListData?.booksInList?.forEach((bookInList) => {
      formik.setFieldValue(
        buildFormikValueName(bookInList.bookId),
        bookInList.comments
      );
    });
  }, [booksListId, booksListsData]);

  useEffect(() => {
    const booksListData = booksListsData.find(
      (booksList) => booksList.listId === booksListId
    );
    if (!booksListData) return;
    const url = decodeURIComponent(booksListData.publicURL ?? "");
    window.history.pushState(window.history.state, "", url);
    return () => {
      if (window.history.state === null) {
        router.push("/lists");
      } else {
        window.history.pushState(window.history.state, "", "/lists");
      }
    };
  }, []);

  const isNewList = useMemo(() => !currentBooksList, [currentBooksList]);

  const isBookInList = useCallback(
    (book: Book) =>
      currentBooksList?.booksInList?.some(
        (bookInList) => bookInList.bookId === book.bookId
      ),
    [currentBooksList]
  );

  const handleAddNewBookClick = async (book: Book) => {
    try {
      if (loadingList.current || loadingBook.current) return;

      if (!listName && isNewList) {
        formik.setFieldError("listName", "List name is required");
        toast.error("List name is required");
        return;
      }
      const newBooksComments = formik.values.newBookComments;
      let bookWithId = book;
      if (!book.bookId) {
        bookWithId = await toast.promise(
          (async () => {
            const bookWithId = await addBook(book);
            return (
              getBookFullData(bookWithId.bookId)?.bookData.book ?? {
                ...book,
                bookId: bookWithId.bookId,
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
          comments: newBooksComments,
          book: bookWithId,
          position: currentBooksList.booksInList?.length - 1 ?? 0,
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
            name: listName,
            description: newListDescription,
            booksInList: [
              {
                bookId: bookWithId.bookId,
                comments: formik.values.newBookComments,
                position: 0,
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
      if (formik.values.newBookComments === newBooksComments) {
        formik.setFieldValue("newBookComments", "");
      }
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

  const scrollSearchBarIntoView = () => {
    if (isSearchBarScrolledIntoView) return;
    const searchBarElement = searchBarRef.current;
    if (searchBarElement) {
      searchBarRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsSearchBarScrolledIntoView(true);
    }
  };

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

  const SearchResult: React.FC<BookComponentProps> = ({ book }) => (
    <BookDetails
      book={book}
      bookThumbnailSize="xs"
      Icon={
        isBookInList(book) ? (
          <Checkmark.Fill className="flex-shrink-0" iconSize="md" />
        ) : (
          <Add.Outline
            className="flex-shrink-0"
            iconSize="xs"
            onClick={(e) => {
              e.stopPropagation();
              handleAddNewBookClick(book);
            }}
          />
        )
      }
    />
  );

  const handlePositionChange = async (
    booksInListWithBook: BookInListWithBook[]
  ) => {
    if (!currentBooksList) return;
    const booksListData: BooksListData = {
      ...currentBooksList,
      booksInList: booksInListWithBook,
    };
    const previousList = { ...currentBooksList };
    setCurrentBookList(booksListData);
    try {
      await toast.promise(updateBooksInListPositions(booksListData), {
        loading: "Updating list...",
        success: "List updated successfully!",
        error: () => {
          setCurrentBookList(previousList);
          return "Failed to update list.";
        },
      });
    } catch (e: any) {}
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-2 pb-4"
      key="modal-books-list"
    >
      <div className="flex flex-col gap-2">
        <ListBooks
          value={formik.values.newBookComments}
          onDeleteBookClick={(bookInList) => {
            handleDeleteBookClick(bookInList);
          }}
          onPositionChange={handlePositionChange}
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
          name="newBookComments"
          booksInList={currentBooksList?.booksInList?.map(
            (bookInList) => bookInList
          )}
        />
        <div ref={searchBarRef}>
          <SearchBarIcon>
            <SearchBar
              formClassName="w-full"
              className="!w-full gap-3 !pr-0"
              onEmpty={() => {
                setIsSearchBarScrolledIntoView(false);
              }}
              onSearch={() => {
                scrollSearchBarIntoView();
              }}
              CustomSearchItem={SearchResult}
              CustomSearchItemSkeleton={() => (
                <div className="flex flex-col gap-6">
                  {Array.from(Array(5)).map((_, index) => (
                    <BookDetailsSkeleton
                      key={`book-details-skeleton-${index}`}
                      bookThumbnailSize="xs"
                    />
                  ))}
                </div>
              )}
            />
          </SearchBarIcon>
        </div>
      </div>
    </div>
  );
};

export default ContentEditBookList;
