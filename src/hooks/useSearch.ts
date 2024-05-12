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
  setStatus,
} from "../lib/features/search/searchSlice";
import { EventTracker } from "../eventTracker";

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
  clearOnExit = true, // Clear redux state when the component unmounts
  limit = 10, // Number of results per page
}: {
  clearOnExit?: boolean;
  limit?: number;
}): UseSearchResult {
  const dispatch = useAppDispatch();
  const { books, lists } = useAppSelector((state) => state.search);
  const { status } = useAppSelector((state) => state.search);
  const searchValueRef = useRef<string>("");

  const [page, setPage] = useState<number>(1);
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
      dispatch(clearResults());
      setResultsToUpdate(null);
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
      dispatch(setStatus("loading"));
      setError(null);
      if (!value) {
        return [];
      }
      EventTracker.track("User searched", {
        query: value,
        path: window.location.pathname,
      });
      searchValueRef.current = value;
      setSearchValue(value);
      const result = await searchAll({ query: value, page, limit });
      if (value !== searchValueRef.current) {
        return;
      }
      if (!result) {
        setResultsToUpdate(null);
        dispatch(setStatus("no-results"));
        return;
      }
      dispatch(setStatus("results"));
      setResultsToUpdate(result);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return;
      }
      Logger.error("Failed to fetch books", { error, data: { query: value } });
      setError(error.message);
      dispatch(setStatus("error"));
      return [];
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
