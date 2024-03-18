import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
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
import { ReadingStatusEnum } from "../models/readingStatus";
import { BooksListData } from "../models/booksList";

const useTable = (readingStatus?: ReadingStatusEnum) => {
  const { userBooksData, loading, error } = useSelector(selectUserBooks);

  const currentReadingStatus = useRef<ReadingStatusEnum | undefined>(readingStatus);
  const [userBooks, setUserBooks] = useState<UserBookData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(40);
  const [totalRecords, setTotalRecords] = useState(0);
  const [readBooksCount, setReadBooksCount] = useState(0);
  const [toReadBooksCount, setToReadBooksCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [sortedBy, setSortedBy] = useState<BookSort>();
  const [filteredBy, setFilteredBy] = useState<
    {
      filter: BookFilter;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    updateUserBooks(currentPage, currentReadingStatus.current, searchValue);
  }, [userBooksData, currentPage]);

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
    let newUserBooks = getFilteredBooks(search, readingStatus).slice(
      0,
      page * pageSize
    );

    setUserBooks(newUserBooks);
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
    // setCurrentPage((prevPage) => {
    //   return prevPage + 1;
    // });
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
  };
};

export default useTable;
