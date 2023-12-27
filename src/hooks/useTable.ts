import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  selectUserBooks,
} from "../lib/features/userBooks/userBooksSlice";
import { UserBookData } from "../models";

const useTable = () => {
  const dispatch = useDispatch();
  const {
    userBooksData,
    error,
  }: { userBooksData: UserBookData[]; error: string | null } =
    useSelector(selectUserBooks);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

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

  return {
    userBooksData,
    loading,
    error,
    currentPage,
    pageSize,
    totalRecords,
    handlePageChange,
    handlePageSizeChange,
  };
};

export default useTable;
