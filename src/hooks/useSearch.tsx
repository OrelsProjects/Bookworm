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
  data: Book[] | null;
  loading: boolean;
}

function useSearch(): UseSearchResult {
  const [searchValue, setSearchValue] = useState<string>("");
  const [books, setBooks] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const updateSearchValue = (value: string) => {
    // if (value === searchValue) {
    //   return;
    // }
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

  // Debounced function
  const debouncedFetchData = debounce(fetchBooks, 300);

  // Effect to trigger the API call
  useEffect(() => {
    if (searchValue === "") {
      setBooks(null);
    }

    if (searchValue) {
      debouncedFetchData(searchValue);
    }
    // Cancel the debounced call if the component is unmounted or the value changes
    return () => debouncedFetchData.cancel();
  }, [searchValue]);

  return { searchValue, updateSearchValue, data: books, loading };
}

export default useSearch;
