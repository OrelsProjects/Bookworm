import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserBooks } from "../lib/features/userBooks/userBooksSlice";
import { UserBookData } from "../models";
import { Logger } from "../logger";
import { BookSort } from "./useBook";
import { sortByTitle, sortByAuthor, sortByDateAdded } from "../utils/bookUtils";
import { ReadingStatusEnum } from "../models/readingStatus";

export enum TableType {
  READ = 1,
  TO_READ = 2,
}

const useTable = () => {
  const { userBooksData, loading, error } = useSelector(selectUserBooks);

  const currentTableType = useRef<TableType>(TableType.TO_READ);
  const [userBooks, setUserBooks] = useState<UserBookData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalRecords, setTotalRecords] = useState(0);
  const [readBooksCount, setReadBooksCount] = useState(0);
  const [toReadBooksCount, setToReadBooksCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    updateUserBooks(currentPage, currentTableType.current, searchValue);
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

  const getFilteredBooks = (tableType: TableType, search: string) => {
    return getSearchBooks(search)
    // .filter(
    //   (userBook) => userBook.readingStatus?.readingStatusId === tableType
    // );
  };

  const updateUserBooks = (
    page: number,
    tableType: TableType,
    search: string = ""
  ) => {
    let newUserBooks = getFilteredBooks(tableType, search).slice(
      0,
      page * pageSize
    );

    setUserBooks(newUserBooks);
    setTotalRecords(userBooksData.length);
    const readBooks = userBooksData.filter(
      (userBook) => userBook.readingStatus?.readingStatusId === ReadingStatusEnum.READ
    );
    const toReadBooks = userBooksData.filter(
      (userBook) =>
        userBook.readingStatus?.readingStatusId === ReadingStatusEnum.TO_READ
    );
    setReadBooksCount(readBooks.length);
    setToReadBooksCount(toReadBooks.length);
  };

  const nextPage = useCallback(() => {
    setCurrentPage((prevPage) => {
      return prevPage + 1;
    });
  }, [currentTableType, updateUserBooks]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const updateTableType = (newTableType: TableType) => {
    currentTableType.current = newTableType;
    setCurrentPage(1);
    updateUserBooks(1, newTableType);
    setSearchValue("");
  };

  const sortBooks = (
    sort: BookSort,
    userBookDataToSort: UserBookData[]
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
    updateUserBooks(3, currentTableType.current, value);
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
    updateTableType,
    searchBooks,
    searchValue,
    readBooksCount,
    toReadBooksCount,
    sortBooks,
  };
};

export default useTable;
