import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  selectUserBooks,
  addUserBooks,
} from "../lib/features/userBooks/userBooksSlice";
import axios from "axios";
import { IResponse } from "../models/dto/response";
import { UserBookData } from "../models";

const useTable = () => {
  const dispatch = useDispatch();
  const { userBooksData: data, error } = useSelector(selectUserBooks);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        localStorage.clear();
        if (localStorage.getItem("userBooks")) {
          const userBooks = localStorage.getItem("userBooks");
          if (userBooks) {
            const parsedUserBooks = JSON.parse(userBooks);
            console.log(parsedUserBooks);
            addUserBooks(parsedUserBooks);
            setTotalRecords(parsedUserBooks.length);
            dispatch(setError(null));
          }
          return;
        }
        const response = await axios.get<IResponse<UserBookData[]>>(
          `api/user-books`
        );
        const { result } = response.data;
        localStorage.setItem("userBooks", JSON.stringify(result));
        dispatch(addUserBooks(result));
        setTotalRecords(result.length);
        dispatch(setError(null));
      } catch (error: any) {
        dispatch(setError(error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  return {
    data,
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
