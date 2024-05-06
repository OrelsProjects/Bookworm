import { useEffect, useMemo, useRef, useState } from "react";
import { selectUserBooks } from "../lib/features/userBooks/userBooksSlice";
import { UserBookData } from "../models";
import { Logger } from "../logger";
import { BookFilter, BookSort } from "./useBook";
import {
  sortByTitle,
  sortByAuthor,
  sortByDateAdded,
  filterByReadlist,
} from "../utils/bookUtils";
import { ReadStatus, ReadingStatusEnum } from "../models/readingStatus";
import { BooksListData } from "../models/booksList";
import { useAppSelector } from "../lib/hooks";

const useTable = (readingStatus?: ReadStatus) => {
  const { userBooksData, loading, error } = useAppSelector(selectUserBooks);

  const currentReadingStatus = useRef<ReadingStatusEnum | undefined>(
    readingStatus === "read"
      ? ReadingStatusEnum.READ
      : ReadingStatusEnum.TO_READ
  );
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortedBy, setSortedBy] = useState<BookSort>();
  const [readBooksCount, setReadBooksCount] = useState(0);
  const [toReadBooksCount, setToReadBooksCount] = useState(0);
  const [userBooks, setUserBooks] = useState<UserBookData[]>([]);
  const [filteredBy, setFilteredBy] = useState<
    {
      filter: BookFilter;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    updateUserBooks(currentPage, currentReadingStatus.current, searchValue);
  }, [userBooksData, currentPage]);

  const toReadBooks = useMemo(() => {
    return userBooksData.filter(
      (userBook) =>
        userBook.readingStatus?.readingStatusId === ReadingStatusEnum.TO_READ
    );
  }, [userBooksData]);

  const readBooks = useMemo(() => {
    return userBooksData.filter(
      (userBook) =>
        userBook.readingStatus?.readingStatusId === ReadingStatusEnum.READ
    );
  }, [userBooksData]);

  const getSearchBooks = (value: string = "") => {
    return [...userBooksData].filter(
      (userBook) =>
        userBook.bookData?.book?.title
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        userBook.bookData?.book?.authors?.some((author) =>
          author.toLowerCase().includes(value.toLowerCase())
        )
    );
  };

  const getFilteredBooks = (
    search: string,
    readingStatus?: ReadingStatusEnum
  ) => {
    let userBooks = getSearchBooks(search);
    if (readingStatus) {
      userBooks = userBooks.filter(
        (userBook) => userBook.readingStatus?.readingStatusId === readingStatus
      );
    }
    return userBooks;
  };

  const updateUserBooks = (
    page: number,
    readingStatus?: ReadingStatusEnum,
    search: string = ""
  ) => {
    let userBooksToAdd = getFilteredBooks(search, readingStatus).slice(
      (page - 1) * pageSize,
      page * pageSize
    );
    if (userBooksToAdd.length === 0 && page > 1) {
      return;
    }

    // Clear existing state if it's the first page
    if (page === 1) {
      setUserBooks(userBooksToAdd);
    } else {
      setUserBooks((prevUserBooks) => [...prevUserBooks, ...userBooksToAdd]);
    }

    setTotalRecords(userBooksData.length);
    const readBooks = userBooksData.filter(
      (userBook) =>
        userBook.readingStatus?.readingStatusId === ReadingStatusEnum.READ
    );
    const toReadBooks = userBooksData.filter(
      (userBook) =>
        userBook.readingStatus?.readingStatusId === ReadingStatusEnum.TO_READ
    );
    setReadBooksCount(readBooks.length);
    setToReadBooksCount(toReadBooks.length);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => {
      return prevPage + 1;
    });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const updateReadingStatus = (newReadingstatus: ReadingStatusEnum) => {
    currentReadingStatus.current = newReadingstatus;
    setCurrentPage(1);
    updateUserBooks(1, newReadingstatus);
    setSearchValue("");
  };

  const filterBooks = (
    filter?: BookFilter,
    value?: string,
    booksLists: BooksListData[] = [],
    userBooksToFilter: UserBookData[] = userBooks
  ): UserBookData[] => {
    let filters = [...filteredBy];
    let filteredBooks = [...userBooksToFilter];
    if (filter && value) {
      const isFilterInUse = filteredBy?.find((f) => f.value === value);
      if (!isFilterInUse) {
        filters.push({ filter, value });
      } else {
        filters = filters.filter((f) => f.value !== value);
      }
    }

    try {
      for (const { filter, value } of filters) {
        switch (filter) {
          case "readlist":
            filteredBooks = filterByReadlist(
              value,
              [...filteredBooks],
              [...booksLists]
            );
            break;
        }
      }
      setFilteredBy(filters);
      return sortedBy ? sortBooks(sortedBy, filteredBooks) : filteredBooks;
    } catch (error: any) {
      Logger.error("Error filtering books", {
        data: {
          filter,
          value,
        },
        error,
      });
      return userBooks;
    }
  };

  const sortBooks = (
    sort?: BookSort,
    userBookDataToSort: UserBookData[] = userBooks
  ): UserBookData[] => {
    try {
      let sortedUserBooks: UserBookData[] = userBookDataToSort;
      switch (sort) {
        case BookSort.Title:
          sortedUserBooks = sortByTitle([...userBookDataToSort]);
          break;
        case BookSort.Author:
          sortedUserBooks = sortByAuthor([...userBookDataToSort]);
          break;
        case BookSort.DateAdded:
          sortedUserBooks = sortByDateAdded([...userBookDataToSort]);
          break;
      }
      setSortedBy(sort);
      return sortedUserBooks;
    } catch (error: any) {
      Logger.error("Error sorting books", {
        data: {
          sort,
          userBookDataToSort,
        },
        error,
      });
      return userBookDataToSort;
    }
  };

  /**
   * Search books by title or author
   * @param value - search value
   */
  const searchBooks = (value: string) => {
    setSearchValue(value);
    updateUserBooks(3, currentReadingStatus.current, value);
  };

  return {
    userBooks,
    loading,
    error,
    currentPage,
    pageSize,
    totalRecords,
    nextPage,
    handlePageSizeChange,
    updateReadingStatus,
    searchBooks,
    searchValue,
    readBooksCount,
    toReadBooksCount,
    sortBooks,
    filterBooks,
    filteredBy,
    toReadBooks,
    readBooks,
  };
};

export default useTable;
