import { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Book } from "../models";
import { IResponse } from "../models/dto/response";
import { Books } from "../models/book";

// Define a type for the hook's return value
export interface UseSearchResult {
  searchValue: string;
  updateSearchValue: (value: string) => void;
  books: Book[] | null;
  loading: boolean;
  addBookToLibrary: (book: Book) => void;
}

function useSearch(): UseSearchResult {
  const [searchValue, setSearchValue] = useState<string>("");
  const [books, setBooks] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const updateSearchValue = (value: string) => {
    if (value === searchValue) {
      return;
    }
    setSearchValue(value);
  };

  const fetchBooks = async (value: string) => {
    try {
      setLoading(true);
      if (!value) {
        return [];
      }
      const response = await axios.get<IResponse<Book[]>>(
        `/api/google-books?query=${value}`
      );
      const books: Books = response.data.result;
      setBooks(books);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addBookToLibrary = async (book: Book) => {
    try {
      const bookList = [book];
      const response = await axios.post<IResponse<Book[]>>(
        "api/books",
        bookList
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Debounced function
  const debouncedFetchData = debounce(fetchBooks, 300);

  useEffect(() => {
    if (searchValue === "") {
      setBooks(null);
    }

    if (searchValue) {
      debouncedFetchData(searchValue);
    }
    return () => debouncedFetchData.cancel();
  }, [searchValue]);

  return { searchValue, updateSearchValue, books, loading, addBookToLibrary };
}

export default useSearch;
