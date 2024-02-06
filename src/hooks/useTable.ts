import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  selectUserBooks,
} from "../lib/features/userBooks/userBooksSlice";
import { UserBookData } from "../models";
import { TableType } from "../components/booksTable/booksTable";

const useTable = ({ initialType }: { initialType: TableType }) => {
  const { userBooksData, loading, error } = useSelector(selectUserBooks);

  const [tableType, setTableType] = useState<TableType>(initialType);
  const [userBooks, setUserBooks] = useState<UserBookData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [readBooksCount, setReadBooksCount] = useState(0);
  const [toReadBooksCount, setToReadBooksCount] = useState(0);

  useEffect(() => {
    updateUserBooks();
  }, [tableType]);

  useEffect(() => {
    updateUserBooks();
    const readBooks = userBooksData.filter(
      (userBook) => userBook.readingStatus?.readingStatusId === TableType.READ
    );
    const toReadBooks = userBooksData.filter(
      (userBook) =>
        userBook.readingStatus?.readingStatusId === TableType.TO_READ
    );
    setReadBooksCount(readBooks.length);
    setToReadBooksCount(toReadBooks.length);
  }, [userBooksData]);

  const updateUserBooks = () => {
    let newUserBooks = [...userBooksData];
    newUserBooks = newUserBooks.filter((userBook) => {
      return userBook.readingStatus?.readingStatusId === tableType;
    });
    setUserBooks(newUserBooks);
    setTotalRecords(userBooksData.length);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const updateTableType = (tableType: TableType) => {
    setTableType(tableType);
  };

  /**
   * Search books by title or author
   * @param value - search value
   */
  const searchBooks = (value: string) => {
    if (value === "") {
      updateUserBooks();
      return;
    }
    let newUserBooks = [...userBooks];
    newUserBooks = newUserBooks.filter((userBook) => {
      return (
        userBook.bookData?.book?.title
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        userBook.bookData?.book?.authors?.some((author) =>
          author.toLowerCase().includes(value.toLowerCase())
        )
      );
    });

    setUserBooks(newUserBooks);
  };

  return {
    userBooks,
    loading,
    error,
    currentPage,
    pageSize,
    totalRecords,
    handlePageChange,
    handlePageSizeChange,
    updateTableType,
    searchBooks,
    readBooksCount,
    toReadBooksCount,
  };
};

export default useTable;
