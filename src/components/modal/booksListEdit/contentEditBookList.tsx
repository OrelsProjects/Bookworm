"use client";
import { useFormik } from "formik";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { BookInList, BookInListWithBook } from "../../../models/bookInList";
import { BooksListData } from "../../../models/booksList";
import BookDetails from "../../book/bookDetails";
import { Add } from "../../icons/add";
import { Checkmark } from "../../icons/checkmark";
import { SearchResultProps } from "../../search/searchResultComponent";
import SearchBar from "../../search/searchBar";
import BookDetailsSkeleton from "../../skeletons/BookDetailsSkeleton";
import useBook from "../../../hooks/useBook";
import { useRouter } from "next/navigation";
import { Book } from "../../../models";
import { DuplicateError } from "../../../models/errors/duplicateError";
import useBooksList from "../../../hooks/useBooksList";
import { Logger } from "../../../logger";
import { buildFormikValueName } from "./modalBooksListEdit";
import { useSelector } from "react-redux";
import { selectBooksLists } from "../../../lib/features/booksLists/booksListsSlice";
import ListBooks from "./dragAndDropBooksInList";
import { useModal } from "../../../hooks/useModal";

export interface ListBookAndBookDetailsProps {
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

const ContentEditBookList = ({
  listName,
  initialBooksListId, // Initial, because if the user creates a new list, this will be empty
  newListDescription,
  onNewListCreated,
}: {
  listName: string;
  initialBooksListId: string;
  newListDescription: string;
  onNewListCreated: (list: BooksListData) => void;
}) => {
  const { showBooksListEditModal } = useModal();
  const router = useRouter();
  const { booksListsData } = useSelector(selectBooksLists);
  const {
    createBooksList,
    addBookToList,
    removeBookFromList,
    updateBooksInListPositions,
    sortByPosition,
    loading: loadingList,
  } = useBooksList();
  const { addBook, getBookFullData, loading: loadingBook } = useBook();
  const [currentBooksList, setCurrentBookList] = useState<
    BooksListData | undefined
  >();
  const [isSearchBarScrolledIntoView, setIsSearchBarScrolledIntoView] =
    useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const formik = useFormik({
    initialValues: {
      newBookComments: "",
    },
    onSubmit: (values) => {},
  });

  useEffect(() => {
    const booksListData = booksListsData.find(
      (booksList) => booksList.listId === initialBooksListId
    );
    updateBooksList(booksListData);
  }, [initialBooksListId]);

  useEffect(() => {
    const booksListData = booksListsData.find(
      (booksList) => booksList.listId === initialBooksListId
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

  const shouldShowSearchBar = useMemo(
    () => (currentBooksList?.booksInList?.length ?? 0) > 0 || showSearchBar,
    [currentBooksList, showSearchBar]
  );

  const isNewList = useMemo(() => !currentBooksList, [currentBooksList]);

  const updateBooksList = (booksListData?: BooksListData) => {
    let sortedBooksListData = sortByPosition(booksListData);
    setCurrentBookList(sortedBooksListData);
    booksListData?.booksInList?.forEach((bookInList) => {
      formik.setFieldValue(
        buildFormikValueName(bookInList.bookId),
        bookInList.comments
      );
    });
  };

  const isBookInList = useCallback(
    (book: Book) =>
      currentBooksList?.booksInList?.some(
        (bookInList) => bookInList.bookId === book.bookId
      ),
    [currentBooksList]
  );

  const handleAddNewBookClick = async (book: Book) => {
    try {
      if (loadingList.current || loadingBook) return;

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
            pending: "Adding new book...",
            success: "Book added successfully!",
            error: "Failed to add book.",
          }
        );
      }

      if (currentBooksList) {
        await toast.promise(
          addBookToList(currentBooksList.listId, bookWithId, newBooksComments),
          {
            pending: `Adding ${book.title} to list...`,
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
            pending: "Creating new list...",
            success: "New list created successfully!",
            error: {
              render(e: any) {
                if (e instanceof DuplicateError) {
                  return "You already have a list with the same name 🤔";
                } else {
                  return "Failed to create list.";
                }
              },
            },
          }
        );
        if (!createBooksListResponse) {
          toast.error("Something went wrong.. We're on it!");
          throw new Error("Failed to create list", {
            cause: { listName, newListDescription, book, newBooksComments },
          });
        }
        setCurrentBookList(createBooksListResponse);
        onNewListCreated(createBooksListResponse);
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
      if (loadingList.current || loadingBook) return;
      if (!currentBooksList) return;

      await toast.promise(
        removeBookFromList(currentBooksList.listId, bookInList.bookId),
        {
          pending: `Removing book from list...`,
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

  const SearchResult: React.FC<SearchResultProps> = ({ book }) => (
    <BookDetails
      book={book}
      bookThumbnailSize="xs"
      Icon={
        book &&
        (isBookInList(book) ? (
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
        ))
      }
    />
  );

  const handlePositionChange = async (
    booksInListWithNewPositions: BookInListWithBook[]
  ) => {
    if (!currentBooksList) return;

    const updatedBooksInList = currentBooksList.booksInList.map(
      (bookInList) => {
        // Find the book in the list of new positions
        const bookWithNewPosition = booksInListWithNewPositions.find(
          (bookInListWithNewPosition) =>
            bookInListWithNewPosition.bookId === bookInList.bookId
        );

        if (bookWithNewPosition) {
          return { ...bookInList, position: bookWithNewPosition.position };
        } else {
          return bookInList;
        }
      }
    );
    updatedBooksInList.sort((a, b) => a.position - b.position);

    const newBooksList = {
      ...currentBooksList,
      booksInList: updatedBooksInList,
    };
    setCurrentBookList(newBooksList);

    try {
      await toast.promise(updateBooksInListPositions(newBooksList), {
        pending: "Updating list...",
        success: {
          render() {
            showBooksListEditModal(newBooksList, {
              shouldAnimate: false,
              popLast: true,
            });
            return "List updated successfully!";
          },
        },
        error: {
          render() {
            setCurrentBookList(currentBooksList);
            return "Failed to update list.";
          },
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
            } else if (bookInList?.book && currentBooksList) {
              formik.setFieldValue(
                buildFormikValueName(bookInList.book.bookId),
                comment
              );
              const updatedBooksInList: BookInListWithBook[] | undefined =
                currentBooksList.booksInList?.map((bookInListInList) => {
                  if (bookInListInList.bookId === bookInList.book.bookId) {
                    return { ...bookInListInList, comments: comment };
                  }
                  return bookInListInList;
                });
              const newBooksList = {
                ...currentBooksList,
                booksInList: updatedBooksInList,
              };

              setCurrentBookList(newBooksList);
            }
          }}
          onNewBookClick={() => {
            searchBarRef.current?.focus();
            setShowSearchBar(true);
          }}
          key={currentBooksList?.listId}
          name="newBookComments"
          booksInList={currentBooksList?.booksInList?.map(
            (bookInList) => bookInList
          )}
        />
        {shouldShowSearchBar && (
          <div ref={searchBarRef} className="h-full w-full">
            <SearchBar
              booksOnly
              formClassName="w-full"
              className="!w-full gap-3 !pr-0"
              onEmpty={() => {
                setIsSearchBarScrolledIntoView(false);
              }}
              onSearch={() => {
                scrollSearchBarIntoView();
              }}
              autoFocus
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditBookList;
