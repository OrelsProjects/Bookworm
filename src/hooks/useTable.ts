import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserBooks } from "../lib/features/userBooks/userBooksSlice";
import { UserBookData } from "../models";
import { TableType } from "../components/booksTable/booksTable";
import { set } from "lodash";

const useTable = () => {
  const { userBooksData, loading, error } = useSelector(selectUserBooks);

  const currentTableType = useRef<TableType>(TableType.TO_READ);
  const [userBooks, setUserBooks] = useState<UserBookData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  const [readBooksCount, setReadBooksCount] = useState(0);
  const [toReadBooksCount, setToReadBooksCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    updateUserBooks(currentPage, currentTableType.current, searchValue);
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

  const getFilteredBooks = (tableType: TableType, search: string) => {
    return getSearchBooks(search).filter(
      (userBook) => userBook.readingStatus?.readingStatusId === tableType
    );
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
      (userBook) => userBook.readingStatus?.readingStatusId === TableType.READ
    );
    const toReadBooks = userBooksData.filter(
      (userBook) =>
        userBook.readingStatus?.readingStatusId === TableType.TO_READ
    );
    setReadBooksCount(readBooks.length);
    setToReadBooksCount(toReadBooks.length);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + 1;
      console.log("Current table type", currentTableType);
      updateUserBooks(newPage, currentTableType.current);
      return newPage;
    });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const updateTableType = (newTableType: TableType) => {
    currentTableType.current = newTableType;
    setCurrentPage(1);
    updateUserBooks(1, newTableType);
    setSearchValue("");
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
  };
};

export default useTable;
