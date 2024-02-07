import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserBooks } from "../lib/features/userBooks/userBooksSlice";
import { UserBookData } from "../models";
import { TableType } from "../components/booksTable/booksTable";

const useTable = () => {
  const { userBooksData, loading, error } = useSelector(selectUserBooks);

  const currentTableType = useRef<TableType>(TableType.TO_READ);
  const [userBooks, setUserBooks] = useState<UserBookData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  const [readBooksCount, setReadBooksCount] = useState(0);
  const [toReadBooksCount, setToReadBooksCount] = useState(0);

  useEffect(() => {
    updateUserBooks(currentPage, currentTableType.current);
  }, [userBooksData]);

  const getFilteredBooks = (tableType: TableType) => {
    return [...userBooksData].filter(
      (userBook) => userBook.readingStatus?.readingStatusId === tableType
    );
  };

  const updateUserBooks = (page: number, tableType: TableType) => {
    let newUserBooks = getFilteredBooks(tableType).slice(0, page * pageSize);

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
  };

  /**
   * Search books by title or author
   * @param value - search value
   */
  const searchBooks = (value: string) => {
    if (value === "") {
      updateUserBooks(currentPage, currentTableType.current);
      return;
    }
    let newUserBooks = getFilteredBooks(currentTableType.current).filter(
      (userBook) => {
        return (
          userBook.bookData?.book?.title
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          userBook.bookData?.book?.authors?.some((author) =>
            author.toLowerCase().includes(value.toLowerCase())
          )
        );
      }
    );

    setUserBooks(newUserBooks);
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
    readBooksCount,
    toReadBooksCount,
  };
};

export default useTable;
