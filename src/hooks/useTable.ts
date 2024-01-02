import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  selectUserBooks,
} from "../lib/features/userBooks/userBooksSlice";
import { UserBookData } from "../models";
import { TableType } from "../components/booksTable/booksTable";

const useTable = ({ initialType }: { initialType: TableType }) => {
  const dispatch = useDispatch();
  const {
    userBooksData,
    loading,
    error,
  } = useSelector(selectUserBooks);
  
  const [tableType, setTableType] = useState<TableType>(initialType);
  const [userBooks, setUserBooks] = useState<UserBookData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    let newUserBooks = [...userBooksData];
    newUserBooks = newUserBooks.filter((userBook) => {
      return userBook.readingStatus?.readingStatusId === tableType;
    });

    setUserBooks(newUserBooks);
  }, [tableType, userBooksData]);

  useEffect(() => {
    setTotalRecords(userBooksData.length);
    dispatch(setError(null));
  }, [userBooksData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const updateTableType = (tableType: TableType) => {
    setTableType(tableType);
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
  };
};

export default useTable;
