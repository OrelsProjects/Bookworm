import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCompleteUserBook,
  setLoading,
  setError,
  setCurrentPage,
  setPageSize,
  setTotalRecords,
  selectCompleteUserBook,
} from "../lib/features/userBooks/userBooksSlice";
import axios from "axios";
import { IResponse } from "../models/dto/response";
import UserBookData from "../models/userBookData";

const useTable = () => {
  const dispatch = useDispatch();
  const { data, loading, error, currentPage, pageSize, totalRecords } =
    useSelector(selectCompleteUserBook);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        if (localStorage.getItem("userBooks")) {
          const userBooks = localStorage.getItem("userBooks");
          if (userBooks) {
            const parsedUserBooks = JSON.parse(userBooks);
            console.log(parsedUserBooks)
            dispatch(setCompleteUserBook(parsedUserBooks));
            dispatch(setTotalRecords(parsedUserBooks.length));
            dispatch(setError(null));
          }
          return;
        }
        const response = await axios.get<IResponse<UserBookData[]>>(
          `api/user-books`
        );
        const { result } = response.data;
        localStorage.setItem("userBooks", JSON.stringify(result));
        dispatch(setCompleteUserBook(result));
        dispatch(setTotalRecords(result.length));
        dispatch(setError(null));
      } catch (error: any) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
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
