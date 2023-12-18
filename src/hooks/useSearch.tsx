import { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { AxiosError } from "axios";
import { Book } from "../models";
import { BookDTO, bookDTOToBook } from "../models/dto/bookDTO";

// Define a type for the hook's return value
export interface UseSearchResult {
  searchValue: string;
  updateSearchValue: (value: string) => void;
  data: Book[] | null;
  loading: boolean;
}

function useSearch(): UseSearchResult {
  const [searchValue, setSearchValue] = useState<string>("");
  const [data, setData] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const updateSearchValue = (value: string) => {
    if (value === searchValue) {
      return;
    }
    setSearchValue(value);
  };

  const fetchData = async (value: string) => {
    try {
      setLoading(true);
      if (!value) {
        setData(null);
        return;
      }
      const response = await axios.get<BookDTO[]>(
        `/google-books?query=${value}`
      );
      const bookDTOs: BookDTO[] = response.data ?? [];
      const books: Book[] = bookDTOs.map((bookDTO: BookDTO) =>
        bookDTOToBook(bookDTO)
      );
      setData(books);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching data:", axiosError.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Debounced function
  const debouncedFetchData = debounce(fetchData, 300);

  // Effect to trigger the API call
  useEffect(() => {
    if (searchValue === "") {
      setData(null);
    }

    if (searchValue) {
      debouncedFetchData(searchValue);
    }
    // Cancel the debounced call if the component is unmounted or the value changes
    return () => debouncedFetchData.cancel();
  }, [searchValue]);

  return { searchValue, updateSearchValue, data, loading };
}

export default useSearch;
