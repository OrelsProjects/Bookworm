import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  selectUserBooks,
} from "../lib/features/userBooks/userBooksSlice";
import { UserBookData } from "../models";
import { TableType } from "../components/booksTable/booksTable";

const useTable = () => {
  const dispatch = useDispatch();
  const [tableType, setTableType] = useState<TableType>(TableType.READ);
  let {
    userBooksData,
    loading,
    error,
  }: { userBooksData: UserBookData[]; loading: boolean; error: string | null } =
    useSelector(selectUserBooks);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    debugger;
    userBooksData = userBooksData.filter((userBook) => {
      userBook.readingStatus?.readingStatusId === tableType;
    });
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
    userBooksData,
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
