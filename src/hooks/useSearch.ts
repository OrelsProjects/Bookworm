import { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Book } from "../models";
import { IResponse } from "../models/dto/response";
import { Books } from "../models/book";
import { EventTracker } from "../eventTracker";
import slugify from "slugify";
import { Logger } from "../logger";

// Define a type for the hook's return value
export interface UseSearchResult {
  searchValue: string;
  books: Book[] | null;
  loading: boolean;
  error: string | null;
  updateSearchValue: (value: string) => void;
}

function useSearch(): UseSearchResult {
  const [searchValue, setSearchValue] = useState<string>("");
  const [results, setResults] = useState<Book[] | null>(null);
  const [resultsToUpdate, setResultsToUpdate] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchCancelToken = axios.CancelToken.source();

  const updateSearchValue = (value: string) => {
    if (value === searchValue) {
      return;
    }
    setSearchValue(value);
  };

  const updateResults = (value: Book[] | null) => {
    if (value === results) {
      return;
    }
    if (!searchValue) {
      setResults(null);
    } else {
      setResults(value);
    }
  };

  useEffect(() => {
    updateResults(resultsToUpdate);
  }, [resultsToUpdate]);

  const fetchBooks = async (value: string) => {
    try {
      setLoading(true);
      setError(null);
      if (!value) {
        return [];
      }
      if (!slugify(value)) {
        return [];
      }
      EventTracker.track("User search new book", { query: value });
      const response = await axios.get<IResponse<Book[]>>(
        `/api/google-books?query=${value}`,
        {
          cancelToken: searchCancelToken.token,
        }
      );
      const books: Books = response.data.result ?? [];
      setResultsToUpdate(books);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return;
      }
      Logger.error("Failed to fetch books", { error, data: { query: value } });
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
      setResultsToUpdate(null);
      setLoading(false);
    }

    if (searchValue) {
      debouncedFetchData(searchValue);
    }
    return () => {
      debouncedFetchData.cancel();
      // searchCancelToken.cancel();
    };
  }, [searchValue]);

  return {
    searchValue,
    updateSearchValue,
    books: results,
    loading,
    error,
  };
}

export default useSearch;
