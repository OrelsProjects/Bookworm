"use client";
import { useRef } from "react";
import { Book, GoodreadsData, User, UserBook, UserBookData } from "../models";
import axios from "axios";
import { Books, CreateBooksResponse } from "../models/book";
import { CreateUserBookBody, UpdateUserBookBody } from "../models/userBook";
import {
  USER_BOOKS_KEY,
  addUserBooks as addUserBooksRedux,
  deleteUserBook as deleteUserBookRedux,
  setUserBooks,
  setUserBooksLoading,
  updateUserBookData,
  updateUserBookGoodreadsData,
} from "../lib/features/userBooks/userBooksSlice";
import { IResponse } from "../models/dto/response";
import {
  AuthStateType,
  selectAuth,
  setError,
} from "../lib/features/auth/authSlice";
import { RootState } from "../lib/store";
import ReadingStatus, { ReadingStatusEnum } from "../models/readingStatus";
import { Logger } from "../logger";
import { EventTracker } from "../eventTracker";
import { isBooksEqualExactly, sortByDateAdded } from "../utils/bookUtils";
import { ErrorDeleteUserBook } from "../models/errors/userBookErrors";
import { useModal } from "./useModal";
import { ErrorUnauthenticated } from "../models/errors/unauthenticatedError";
import { useAppDispatch, useAppSelector } from "../lib/hooks";

const getUserBooksFromLocalStorage = (): UserBookData[] => {
  return JSON.parse(
    localStorage.getItem(USER_BOOKS_KEY) ?? "[]"
  ) as UserBookData[];
};

export enum BookSort {
  Title = "Title",
  Author = "Author",
  DateAdded = "DateAdded",
}

export type BookFilter = "readlist" | "status";

const useBook = () => {
  const loading = useRef(false);
  const dispatch = useAppDispatch();
  const { user, state } = useAppSelector(selectAuth);
  const { userBooksData } = useAppSelector(
    (state: RootState) => state.userBooks
  );
  const { showRegisterModal } = useModal();

  const openRegisterModal = () => {
    if (!user || state !== AuthStateType.SIGNED_IN) {
      showRegisterModal();
      return true;
    }
    return false;
  };

  const deleteUserBookWithBook = async (book: Book) => {
    const userBook = userBooksData.find(
      (userBookData) => userBookData.bookData?.book?.bookId === book.bookId
    );
    if (!userBook) {
      throw new Error("No user book found for book");
    }
    await deleteUserBook(userBook.userBook);
  };

  const deleteUserBook = async (userBook: UserBook): Promise<void> => {
    if (loading.current) {
      throw new Error("Cannot delete book while another book is loading");
    }
    loading.current = true;
    try {
      const response = await axios.delete<IResponse<void>>("/api/user-books", {
        data: {
          userBookId: userBook.userBookId,
        },
      });
      if (response.status !== 200) {
        // throw ErrorDeleteUserBook
        throw new ErrorDeleteUserBook("Failed to delete book");
      }
      dispatch(deleteUserBookRedux(userBook.userBookId));
    } catch (error: any) {
      if (error! instanceof ErrorDeleteUserBook) {
        // ErrorDeleteUserBook is logged in route
        Logger.error("Error deleting book", {
          data: {
            userBook,
          },
          error,
        });
      }
      throw error;
    } finally {
      loading.current = false;
    }
  };

  const addBook = async (book: Book): Promise<Book> => {
    const responseAddBooks = await axios.post<IResponse<CreateBooksResponse>>(
      "/api/books",
      book
    );
    const createBookResponse = responseAddBooks.data.result ?? {};
    const books: Books =
      createBookResponse.success?.concat(createBookResponse.duplicates ?? []) ??
      [];

    if (books.length === 0) {
      throw new Error("No books returned from backend");
    }
    return books[0];
  };

  const addUserBook = async ({
    book,
    suggestionSource,
    userComments,
    dateAdded,
    userRating,
    readingStartDate,
    readingFinishDate,
    readingStatusId,
  }: {
    book: Book;
    isFavorite?: boolean;
    suggestionSource?: string;
    userComments?: string;
    dateAdded?: string;
    userRating?: number;
    readingStartDate?: string;
    readingFinishDate?: string;
    readingStatusId?: ReadingStatusEnum;
  }): Promise<UserBook> => {
    if (loading.current) {
      throw new Error("Cannot add book while another book is loading");
    }
    if (openRegisterModal()) {
      throw new ErrorUnauthenticated("User not authenticated");
    }
    loading.current = true;
    EventTracker.track("User add book", {
      book,
      suggestionSource,
      userComments,
      dateAdded,
      userRating,
      readingStartDate,
      readingFinishDate,
      readingStatusId,
    });
    try {
      let bookToAdd: Book = { ...book };
      let createUserBookBody: CreateUserBookBody = {
        bookId: book.bookId,
        isFavorite: false,
        suggestionSource: suggestionSource ?? "",
        userComments: userComments ?? "",
        dateAdded: dateAdded ?? new Date().toISOString(),
        userRating: userRating,
        readingStartDate: readingStartDate ?? new Date().toISOString(),
        readingFinishDate: readingFinishDate ?? new Date().toISOString(),
        readingStatusId: readingStatusId,
      };
      if (!bookToAdd.bookId) {
        const newBook = await addBook(book);
        createUserBookBody = {
          ...createUserBookBody,
          bookId: newBook.bookId,
        };
      }
      const responseAddUserBooks = await axios.post<IResponse<UserBook>>(
        "/api/user-books",
        createUserBookBody
      );
      const userBook: UserBook | undefined = responseAddUserBooks.data.result;

      if (!userBook) {
        throw new Error("No user books returned from backend");
      }

      const userBookData: UserBookData = {
        userBook,
        bookData: {
          book: { ...bookToAdd, bookId: createUserBookBody.bookId },
        },
        readingStatus: new ReadingStatus(userBook.readingStatusId),
      };
      dispatch(addUserBooksRedux([userBookData]));
      return userBook;
    } catch (error: any) {
      Logger.error("Error adding user book", {
        data: {
          book,
          suggestionSource,
          userComments,
          dateAdded,
          userRating,
          readingStartDate,
          readingFinishDate,
        },
        error,
      });
      throw error;
    } finally {
      loading.current = false;
    }
  };

  const loadUserBooks = async (user?: User | null) => {
    try {
      if (loading.current) {
        return;
      }
      loading.current = true;

      let currentUserBooks = getUserBooksFromLocalStorage();
      if (currentUserBooks) {
        if (Array.isArray(currentUserBooks)) {
          dispatch(setUserBooks(sortByDateAdded([...currentUserBooks])));
        }
      }

      dispatch(
        setUserBooksLoading({ loading: true, dontLoadIfBooksExist: false })
      ); // Show loading to prevent empty screen from showing while redux is loading
      setTimeout(() => {
        dispatch(
          setUserBooksLoading({ loading: true, dontLoadIfBooksExist: true })
        );
      }, 50); // 50ms to prevent loading spinner from flashing

      if (user) {
        axios.defaults.headers.common["Authorization"] = user.token;
        axios.defaults.headers.common["user_id"] = user.userId;
      }

      const response = await axios.get<IResponse<UserBookData[]>>(
        `api/user-books`
      );

      let { result } = response.data;
      result = sortByDateAdded([...(result ?? [])]);
      dispatch(setUserBooks(result ?? []));
      dispatch(setError(null));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      loading.current = false;
      dispatch(setUserBooksLoading({ loading: false }));
    }
  };

  const getBookGoodreadsData = async (book: Book): Promise<GoodreadsData> => {
    try {
      const isbn = book.isbn;
      if (!isbn) {
        throw new Error("No isbn found for book");
      }
      const response = await axios.get<IResponse<GoodreadsData>>(
        `/api/goodreads`,
        {
          params: {
            isbn,
          },
        }
      );
      const { result } = response.data;
      if (!result) {
        throw new Error("No goodreads data returned from backend");
      }
      dispatch(updateUserBookGoodreadsData({ book, goodreadsData: result }));
      return result;
    } catch (error: any) {
      Logger.error("Error getting goodreads data", {
        data: {
          book,
        },
        error,
      });
      throw error;
    }
  };

  const updateUserBook = async (
    updateBookBody: UpdateUserBookBody
  ): Promise<UserBook | undefined> => {
    if (loading.current) {
      return;
    }
    loading.current = true;
    EventTracker.track("User update book", {
      updateBookBody,
    });
    try {
      const response = await axios.patch<IResponse<UserBook>>(
        "/api/user-books",
        updateBookBody
      );
      const newUserBook = response.data.result;
      if (!newUserBook) {
        throw new Error("No user book returned from backend");
      }
      let userBookData: UserBookData | undefined = userBooksData.find(
        (userBookData) => userBookData.userBook.userBookId === newUserBook.userBookId
      );

      if (!userBookData) {
        throw new Error("No user book data found");
      }
      userBookData = {
        ...userBookData,
        userBook: newUserBook,
        readingStatus: new ReadingStatus(updateBookBody.readingStatusId),
      };
      dispatch(updateUserBookData(userBookData));
      return newUserBook;
    } catch (error: any) {
      Logger.error("Error updating user book", {
        data: {
          updateBookBody,
        },
        error,
      });
      throw error;
    } finally {
      loading.current = false;
    }
  };

  const updateBookReadingStatus = async (
    userBook: UserBook,
    readingStatus: ReadingStatusEnum
  ) => {
    const updateBookBody: UpdateUserBookBody = {
      userBookId: userBook.userBookId,
      userId: userBook.userId,
      readingStatusId: readingStatus,
    };
    await updateUserBook(updateBookBody);
  };

  function getBookFullData(bookId: number): UserBookData | null;
  function getBookFullData(book: Book): UserBookData | null;
  function getBookFullData(bookOrBookId: Book | number): UserBookData | null {
    if (typeof bookOrBookId === "number") {
      return (
        userBooksData.find(
          (userBookData) => userBookData.bookData?.book?.bookId === bookOrBookId
        ) ?? null
      );
    } else {
      return (
        userBooksData.find((userBookData) => {
          const isEqual = isBooksEqualExactly(
            userBookData.bookData?.book,
            bookOrBookId
          );
          return isEqual;
        }) ?? null
      );
    }
  }

  return {
    addBook,
    addUserBook,
    loadUserBooks,
    userBooksData,
    updateUserBook,
    deleteUserBook,
    getBookFullData,
    getBookGoodreadsData,
    deleteUserBookWithBook,
    updateBookReadingStatus,
    loading: loading.current,
  };
};

export default useBook;
