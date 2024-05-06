import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Logger } from "../logger";
import { searchAll } from "../lib/api";
import { SearchResults, SearchStatus } from "../models/search";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  clearResults,
  setSearchResults,
} from "../lib/features/search/searchSlice";

// Define a type for the hook's return value
export interface UseSearchResult {
  searchValue: string;
  results: SearchResults | null;
  status: SearchStatus;
  error: string | null;
  nextPage: () => void;
  search: (value: string) => void;
}

function useSearch({
  clearOnExit = true,
}: {
  clearOnExit?: boolean;
}): UseSearchResult {
  const dispatch = useAppDispatch();
  const { books, lists } = useAppSelector((state) => state.search);
  const searchValueRef = useRef<string>("");

  const [limit, _] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "results" | "no-results"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [resultsToUpdate, setResultsToUpdate] = useState<SearchResults | null>(
    null
  );

  useEffect(() => {
    if (books || lists) {
      setResultsToUpdate({ books: books || [], lists: lists || [] });
    }
    return () => {
      if (clearOnExit) {
        dispatch(clearResults());
      }
    };
  }, []);

  useEffect(() => {
    dispatch(setSearchResults({ results: resultsToUpdate }));
    updateResults(resultsToUpdate);
  }, [resultsToUpdate]);

  // Search useEffect
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
    };
  }, [searchValue]);

  const updateResults = (value: SearchResults | null) => {
    if (value === results) {
      return;
    }
    if (!searchValue) {
      setResults(null);
    } else {
      setResults(value);
    }
  };

  const search = async (value: string) => {
    try {
      setStatus("loading");
      setError(null);
      if (!value) {
        return [];
      }
      searchValueRef.current = value;
      setSearchValue(value);
      const result = await searchAll({ query: value, page, limit });
      if (value !== searchValueRef.current) {
        return;
      }
      if (!result) {
        setResultsToUpdate(null);
        setStatus("no-results");
        return;
      }
      setStatus("results");
      setResultsToUpdate(result);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return;
      }
      Logger.error("Failed to fetch books", { error, data: { query: value } });
      setError(error.message);
      setStatus("error");
      return [];
    } finally {
      // If different value is being searched, return
      if (searchValueRef.current && searchValueRef.current !== value) {
        return;
      }
    }
  };

  /**
   * Update search value so the useEffect can call debounced search
   * @param value is the search value
   */
  const updateSearchValue = (value: string) => {
    searchValueRef.current = value;
    setSearchValue(value);
  };

  const debouncedFetchData = debounce(search, 300);

  const nextPage = () => {
    setPage(page + 1);
  };

  return {
    error,
    status,
    results,
    nextPage,
    searchValue,
    search: updateSearchValue,
  };
}

export default useSearch;
