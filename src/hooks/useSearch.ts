import { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Book } from "../models";
import { IResponse } from "../models/dto/response";
import { Books } from "../models/book";

// Define a type for the hook's return value
export interface UseSearchResult {
  searchValue: string;
  books: Book[] | null;
  loading: boolean;
  loadingAddBook: Book | null;
  error: string | null;
  updateSearchValue: (value: string) => void;
}

function useSearch(): UseSearchResult {
  const [searchValue, setSearchValue] = useState<string>("");
  const [results, setResults] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingAddBook, setLoadingAddBook] = useState<Book | null>(null);

  const updateSearchValue = (value: string) => {
    if (value === searchValue) {
      return;
    }
    setSearchValue(value);
  };

  const fetchBooks = async (value: string) => {
    try {
      setLoading(true);
      setError(null);
      if (!value) {
        return [];
      }
      const response = await axios.get<IResponse<Book[]>>(
        `/api/google-books?query=${value}`
      );
      const books: Books = response.data.result ?? [];
      setResults(books);
    } catch (error: any) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Debounced function
  const debouncedFetchData = debounce(fetchBooks, 300);

  useEffect(() => {
    if (searchValue === "") {
      setResults(null);
    }

    if (searchValue) {
      debouncedFetchData(searchValue);
    }
    return () => debouncedFetchData.cancel();
  }, [searchValue]);

  return {
    searchValue,
    updateSearchValue,
    books: results,
    loading,
    loadingAddBook,
    error,
  };
}

export default useSearch;
