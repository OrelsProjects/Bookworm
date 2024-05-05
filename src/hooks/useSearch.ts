import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Book } from "../models";
import { Logger } from "../logger";
import { searchAll } from "../lib/api";
import { SearchResults } from "../models/search";

// Define a type for the hook's return value
export interface UseSearchResult {
  searchValue: string;
  results: SearchResults | null;
  loading: boolean;
  error: string | null;
  nextPage: () => void;
  search: (value: string) => void;
}

function useSearch(): UseSearchResult {
  const searchValueRef = useRef<string>("");

  const [limit, _] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [resultsToUpdate, setResultsToUpdate] = useState<SearchResults | null>(
    null
  );

  useEffect(() => {
    updateResults(resultsToUpdate);
  }, [resultsToUpdate]);

  // Search useEffect
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
      setLoading(true);
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
        return;
      }

      setResultsToUpdate(result);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return;
      }
      Logger.error("Failed to fetch books", { error, data: { query: value } });
      setError(error.message);
      return [];
    } finally {
      if (searchValueRef.current && searchValueRef.current !== value) {
        return;
      }
      setLoading(false);
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
    loading,
    results,
    nextPage,
    searchValue,
    search: updateSearchValue,
  };
}

export default useSearch;
