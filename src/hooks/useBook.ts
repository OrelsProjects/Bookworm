"use client";
import { useState } from "react";
import { Book, GoodreadsData, User, UserBook, UserBookData } from "../models";
import axios from "axios";
import { Books, CreateBooksResponse } from "../models/book";
import {
  CreateUserBookBody,
  UpdateUserBookBody,
} from "../models/dto/userBookDTO";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserBooks as addUserBooksRedux,
  deleteUserBook as deleteUserBookRedux,
  setUserBooks,
  setUserBooksLoading,
  updateUserBookData,
  updateUserBookGoodreadsData,
} from "../lib/features/userBooks/userBooksSlice";
import { IResponse } from "../models/dto/response";
import { setError } from "../lib/features/auth/authSlice";
import { RootState } from "../lib/store";
import ReadingStatus from "../models/readingStatus";
import { Logger } from "../logger";
import { EventTracker } from "../eventTracker";

// ErrorDeleteUserBook error class
class ErrorDeleteUserBook extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ErrorDeleteUserBook";
  }
}

const useBook = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { userBooksData } = useSelector((state: RootState) => state.userBooks);

  const favoriteBook = async (userBook: UserBook): Promise<void> => {
    if (loading) {
      throw new Error("Cannot favorite book while another book is loading");
    }
    setLoading(true);
    try {
      const isFavorite = !userBook.isFavorite;
      const updateUserBookBody: UpdateUserBookBody = {
        user_book_id: userBook.userBookId,
        is_favorite: isFavorite,
      };
      await axios.patch<UserBook>(`/api/user-books`, updateUserBookBody);
      let userBookData: UserBookData | undefined = userBooksData.find(
        (userBookData) =>
          userBookData.userBook.userBookId === userBook.userBookId
      );
      if (!userBookData) {
        throw new Error("No user book data found");
      }
      userBookData = {
        ...userBookData,
        userBook: {
          ...userBookData.userBook,
          isFavorite,
        },
      };
      dispatch(updateUserBookData(userBookData));
    } catch (error: any) {
      Logger.error("Error favoriting book", {
        data: {
          userBook,
        },
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUserBook = async (userBook: UserBook): Promise<void> => {
    if (loading) {
      throw new Error("Cannot delete book while another book is loading");
    }
    setLoading(true);
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
      setLoading(false);
    }
  };

  const addUserBook = async (
    book: Book,
    isFavorite?: boolean,
    suggestionSource?: string,
    userComments?: string,
    dateAdded?: string,
    userRating?: number,
    readingStartDate?: Date,
    readingFinishDate?: Date
  ): Promise<UserBook> => {
    if (loading) {
      throw new Error("Cannot add book while another book is loading");
    }
    setLoading(true);
    EventTracker.track("User add book", {
      book,
      isFavorite,
      suggestionSource,
      userComments,
      dateAdded,
      userRating,
      readingStartDate,
      readingFinishDate,
    });
    try {
      const responseAddBooks = await axios.post<IResponse<CreateBooksResponse>>(
        "/api/books",
        book
      );
      const createBookResponse = responseAddBooks.data.result ?? {};
      const books: Books =
        createBookResponse.success?.concat(
          createBookResponse.duplicates ?? []
        ) ?? [];
      if (books.length === 0) {
        throw new Error("No books returned from backend");
      }
      const bookToAdd = books[0];
      const createUserBookBody: CreateUserBookBody = {
        book_id: books[0].bookId,
        is_favorite: isFavorite ?? false,
        suggestion_source: suggestionSource ?? "",
        user_comments: userComments ?? "",
        date_added: dateAdded ?? new Date().toISOString(),
        user_rating: userRating,
        reading_start_date: readingStartDate ?? new Date().toISOString(),
        reading_finish_date: readingFinishDate ?? new Date().toISOString(),
      };
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
          book: bookToAdd,
        },
        readingStatus: new ReadingStatus(userBook.readingStatusId),
      };
      dispatch(addUserBooksRedux([userBookData]));
      return userBook;
    } catch (error: any) {
      Logger.error("Error adding user book", {
        data: {
          book,
          isFavorite,
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
      setLoading(false);
    }
  };

  const loadUserBooks = async (user?: User): Promise<void> => {
    try {
      if (loading) {
        throw new Error("Cannot load user books while another book is loading");
      }
      if (!user || !user.userId) {
        return;
      }
      const currentUserBooks = localStorage.getItem("userBooks");
      if (currentUserBooks) {
        dispatch(setUserBooks(JSON.parse(currentUserBooks)));
      }

      setLoading((loading) => !loading);
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
      } else {
        return;
      }

      const response = await axios.get<IResponse<UserBookData[]>>(
        `api/user-books`
      );

      const { result } = response.data;
      dispatch(setUserBooks(result ?? []));
      dispatch(setError(null));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      setLoading(false);
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
  ): Promise<UserBook> => {
    if (loading) {
      throw new Error("Cannot update user book while another book is loading");
    }
    setLoading(true);
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
        (userBookData) =>
          userBookData.userBook.userBookId === newUserBook.userBookId
      );

      if (!userBookData) {
        throw new Error("No user book data found");
      }
      userBookData = {
        ...userBookData,
        userBook: newUserBook,
        readingStatus: new ReadingStatus(updateBookBody.reading_status_id),
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
      setLoading(false);
    }
  };

  return {
    getBookGoodreadsData,
    updateUserBook,
    loadUserBooks,
    addUserBook,
    favoriteBook,
    deleteUserBook,
    loading,
  };
};

export default useBook;
