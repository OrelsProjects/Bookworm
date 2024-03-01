import { useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { Logger } from "../logger";
import {
  setBooksListsLoading,
  setBooksLists,
  addBooksList,
  updateBooksList as updateBooksListAction,
  deleteBooksList as deleteBooksListAction,
  addBookToList as addBookToListAction,
  removeBookFromList as removeBookFromListAction,
} from "../lib/features/booksLists/booksListsSlice";
import {
  BooksList,
  BooksListData,
  CreateBooksListPayload,
} from "../models/booksList";
import { Book } from "../models";

const useBooksList = () => {
  const loading = useRef(false);
  const dispatch = useDispatch();
  const booksLists = useSelector(
    (state: RootState) => state.booksLists.booksLists
  );

  const fetchUsersBooksLists = async () => {
    if (loading.current) {
      throw new Error(
        "Operation in progress. Please wait until the current operation completes."
      );
    }
    loading.current = true;
    dispatch(setBooksListsLoading(true));
    try {
      const response = await axios.get("/api/list");
      const booksListsData = response.data;
      dispatch(setBooksLists(booksListsData));
    } catch (error: any) {
      Logger.error("Failed to fetch users books lists", error);
    } finally {
      loading.current = false;
      dispatch(setBooksListsLoading(false));
    }
  };

  const createBooksList = async (booksListPayload: CreateBooksListPayload) => {
    try {
      const response = await axios.post("/api/list", booksListPayload);
      const booksListData: BooksListData = response.data;
      dispatch(addBooksList(booksListData));
    } catch (error: any) {
      Logger.error("Failed to create books list", error);
    }
  };

  const updateBooksList = async (booksList: BooksList) => {
    try {
      await axios.patch(`/api/list/`, booksList);
      dispatch(updateBooksListAction(booksList));
    } catch (error: any) {
      Logger.error("Failed to update books list", error);
    }
  };

  const deleteBooksList = async (listId: string) => {
    try {
      await axios.delete(`/api/list/${listId}`);
      dispatch(deleteBooksListAction(listId));
    } catch (error: any) {
      Logger.error("Failed to delete books list", error);
    }
  };

  const addBookToList = async (listId: string, book: Book) => {
    try {
      const urlParams = new URLSearchParams();
      await axios.post(`/api/list/book`, {
        listId,
        bookId: book.bookId,
      });
      dispatch(addBookToListAction({ listId, book }));
    } catch (error: any) {
      Logger.error("Failed to add book to list", error);
    }
  };

  const removeBookFromList = async (listId: string, bookId: number) => {
    try {
      const urlParams = new URLSearchParams();
      urlParams.append("listId", listId);
      urlParams.append("bookId", bookId.toString());
      
      await axios.delete(`/api/list/book`, {
        params: urlParams,
      });
      dispatch(removeBookFromListAction({ listId, bookId }));
    } catch (error: any) {
      Logger.error("Failed to remove book from list", error);
    }
  };

  return {
    booksLists,
    loading: loading.current,
    fetchUsersBooksLists,
    createBooksList,
    updateBooksList,
    deleteBooksList,
    addBookToList,
    removeBookFromList,
  };
};

export default useBooksList;
