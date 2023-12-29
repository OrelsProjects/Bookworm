"use client";
import { useState } from "react";
import { Book, GoodreadsData, User, UserBook, UserBookData } from "../models";
import axios from "axios";
import { Books, CreateBooksResponse } from "../models/book";
import {
  CreateUserBookBody,
  UpdateUserBookBody,
} from "../models/dto/userBookDTO";
import { useDispatch } from "react-redux";
import {
  addUserBooks,
  setUserBooks,
  updateUserBook,
  updateUserBookData,
} from "../lib/features/userBooks/userBooksSlice";
import { IResponse } from "../models/dto/response";
import { setError } from "../lib/features/auth/authSlice";

const useBook = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
      await axios.put<UserBook>(`/api/user-books`, updateUserBookBody);

      dispatch(
        updateUserBook({
          ...userBook,
          isFavorite,
        })
      );
    } catch (error) {
      console.error(error);
      // throw error;
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
        {
          createUserBookBody,
        }
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
      };
      dispatch(addUserBooks([userBookData]));
      return userBook;
    } catch (error) {
      console.error(error);
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
      setLoading(true);

      if (user) {
        axios.defaults.headers.common["Authorization"] = user.token;
        axios.defaults.headers.common["user_id"] = user.id;
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
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    getBookGoodreadsData,
    loadUserBooks,
    addUserBook,
    favoriteBook,
    loading,
  };
};

export default useBook;
