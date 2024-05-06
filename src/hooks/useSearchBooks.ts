import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Book } from "../models";
import { IResponse } from "../models/dto/response";
import { Books } from "../models/book";
import { EventTracker } from "../eventTracker";
import { Logger } from "../logger";
import { searchBooks } from "../lib/api";
import { SearchStatus } from "../models/search";

// Define a type for the hook's return value
export interface UseSearchResult {
  searchValue: string;
  results: Book[] | null;
  status: SearchStatus;
  error: string | null;
  search: (value: string) => void;
}

function useSearchBooks(): UseSearchResult {
  //  loading, error, search, results, searchValue
  const [searchValue, setSearchValue] = useState<string>("");
  const searchValueRef = useRef<string>("");
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [results, setResults] = useState<Book[] | null>(null);
  const [resultsToUpdate, setResultsToUpdate] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = (value: string) => {
    if (value === searchValue) {
      return;
    }
    setSearchValue(value);
    searchValueRef.current = value;
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
      setStatus("loading");
      setError(null);
      if (!value) {
        return [];
      }
      const books = await searchBooks({ query: value, page: 1, limit: 10 });
      if (value !== searchValueRef.current) {
        return;
      }
      setStatus(books?.length ? "results" : "no-results");
      setResultsToUpdate(books || []);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return;
      }
      Logger.error("Failed to fetch books", { error, data: { query: value } });
      setStatus("error");
      setError(error.message);
      return [];
    } finally {
      if (searchValueRef.current && searchValueRef.current !== value) {
        return;
      }
    }
  };

  // Debounced function
  const debouncedFetchData = debounce(fetchBooks, 300);

  useEffect(() => {
    if (searchValue === "") {
      setResultsToUpdate(null);
      setStatus("idle");
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
    search,
    results,
    status,
    error,
  };
}

export default useSearchBooks;
