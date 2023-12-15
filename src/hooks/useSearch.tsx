import { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { AxiosError } from "axios";
import { Book } from "../models";
import { BookDTO, bookDTOToBook } from "../models/dto/bookDTO";

// Define a type for the hook's return value
export interface UseSearchResult {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  data: Book[] | null;
}

function useSearch(): UseSearchResult {
  const [searchValue, setSearchValue] = useState<string>("");
  const [data, setData] = useState<Book[] | null>(null);

  const fetchData = async (value: string) => {
    try {
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
    }
  };

  // Debounced function
  const debouncedFetchData = debounce(fetchData, 300);

  // Effect to trigger the API call
  useEffect(() => {
    if (searchValue) {
      debouncedFetchData(searchValue);
    }
    // Cancel the debounced call if the component is unmounted or the value changes
    return () => debouncedFetchData.cancel();
  }, [searchValue]);

  return { searchValue, setSearchValue, data };
}

export default useSearch;
