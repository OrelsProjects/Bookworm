import { useEffect, useRef } from "react";
import axios, { CanceledError } from "axios";
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
  updateBookInList as updateBookInListAction,
} from "../lib/features/booksLists/booksListsSlice";
import {
  BooksList,
  BooksListData,
  CreateBooksListPayload,
} from "../models/booksList";
import { Book, User } from "../models";
import { IResponse } from "../models/dto/response";
import { DuplicateError } from "../models/errors/duplicateError";
import { BookInList } from "../models/bookInList";
import { LoadingError } from "../models/errors/loadingError";

const BOOK_LIST_DATA_KEY = "booksListData";

const getBooksListFromLocalStorage = (): BooksListData[] => {
  return JSON.parse(
    localStorage.getItem(BOOK_LIST_DATA_KEY) ?? "[]"
  ) as BooksListData[];
};

const setListInLocalStorage = (booksList: BooksListData[]) => {
  localStorage.removeItem(BOOK_LIST_DATA_KEY);
  localStorage.setItem(BOOK_LIST_DATA_KEY, JSON.stringify(booksList));
};

const addBookToListInLocalStorage = (book: Book, listId: string) => {
  const booksListData: BooksListData[] = getBooksListFromLocalStorage();
  booksListData?.forEach((list) => {
    if (list.listId === listId) {
      list.booksInList?.push({
        book,
        listId,
        bookId: book.bookId,
      });
    }
  });
  setListInLocalStorage(booksListData);
};

const updateBookInListInLocalStorage = (bookInList: BookInList) => {
  const booksListData: BooksListData[] = getBooksListFromLocalStorage();
  booksListData?.forEach((list) => {
    if (list.listId === bookInList.listId && list.booksInList) {
      list.booksInList = list.booksInList?.map((bookInListWithBook) =>
        bookInListWithBook.bookId === bookInList.bookId
          ? { ...bookInListWithBook, ...bookInList }
          : bookInListWithBook
      );
    }
  });
  setListInLocalStorage(booksListData);
};

const deleteBookFromListInLocalStorage = (listId: string, bookId: number) => {
  const booksListData: BooksListData[] = getBooksListFromLocalStorage();
  booksListData?.forEach((list) => {
    if (list.listId === listId) {
      list.booksInList = list.booksInList?.filter(
        (bookInList) => bookInList.bookId !== bookId
      );
    }
  });
  setListInLocalStorage(booksListData);
};

const deleteListInLocalStorage = (listId: string) => {
  const booksListData: BooksListData[] = getBooksListFromLocalStorage();
  const updatedBooksListData = booksListData.filter(
    (list) => list.listId !== listId
  );
  setListInLocalStorage(updatedBooksListData);
};

const updateListInLocalStorage = (booksListData: BooksListData) => {
  const booksListDataFromLocalStorage = getBooksListFromLocalStorage();
  const updatedBooksListData = booksListDataFromLocalStorage.map((list) =>
    list.listId === booksListData.listId ? booksListData : list
  );
  setListInLocalStorage(updatedBooksListData);
};

const useBooksList = () => {
  const loading = useRef(false);
  const dispatch = useDispatch();
  const booksLists = useSelector(
    (state: RootState) => state.booksLists.booksListsData
  );

  const updateBooksListCancelToken = axios.CancelToken.source();
  const updateBookInListCancelToken = axios.CancelToken.source();

  useEffect(() => {
    localStorage.removeItem("booksList");
  }, []);

  const loadUserBooksLists = async (user?: User | null) => {
    if (loading.current) {
      throw new LoadingError(
        "Operation in progress. Please wait until the current operation completes."
      );
    }

    const currentBooksList = getBooksListFromLocalStorage();
    if (currentBooksList) {
      if (Array.isArray(currentBooksList)) {
        dispatch(setBooksLists([...currentBooksList]));
      }
    }

    loading.current = true;
    dispatch(setBooksListsLoading(true));
    try {
      if (user) {
        axios.defaults.headers.common["Authorization"] = user.token;
        axios.defaults.headers.common["user_id"] = user.userId;
      }

      const response = await axios.get<IResponse<BooksListData[]>>("/api/lists");
      const booksListsDataResponse = response.data.result ?? [];

      dispatch(setBooksLists(booksListsDataResponse ?? []));
      setListInLocalStorage(booksListsDataResponse ?? []);
    } catch (error: any) {
      Logger.error("Failed to fetch users books lists", error);
    } finally {
      loading.current = false;
      dispatch(setBooksListsLoading(false));
    }
  };

  const createBooksList = async (
    booksListPayload: CreateBooksListPayload
  ): Promise<BooksListData | undefined> => {
    try {
      loading.current = true;
      const response = await axios.post<IResponse<BooksListData>>(
        "/api/list",
        booksListPayload
      );
      const booksListData: BooksListData | undefined = response.data.result;
      if (booksListData) {
        dispatch(addBooksList(booksListData));
        setListInLocalStorage([...booksLists, booksListData]);
      }
      return booksListData;
    } catch (error: any) {
      Logger.error("Failed to create books list", error);
      if (error.response?.status === 409) {
        throw new DuplicateError("List with the same name already exists");
      }
      throw error;
    } finally {
      loading.current = false;
    }
  };

  const cancelUpdateBooksList = () => {
    updateBooksListCancelToken.cancel("Operation cancelled by user");
  };

  const updateBooksList = async (booksListData: BooksListData) => {
    try {
      const { booksInList, ...booksList } = booksListData;
      await axios.patch(`/api/list/`, booksList, {
        cancelToken: updateBooksListCancelToken.token,
      });
      dispatch(updateBooksListAction(booksListData));
      updateListInLocalStorage(booksListData);
    } catch (error: any) {
      Logger.error("Failed to update books list", error);
      throw error;
    }
  };

  const deleteBooksList = async (listId: string) => {
    try {
      await axios.delete(`/api/list/${listId}`);
      dispatch(deleteBooksListAction(listId));
      deleteListInLocalStorage(listId);
    } catch (error: any) {
      Logger.error("Failed to delete books list", error);
      throw error;
    }
  };

  const addBookToList = async (listId: string, book: Book) => {
    try {
      await axios.post(`/api/list/book`, {
        listId,
        bookId: book.bookId,
      });
      dispatch(addBookToListAction({ listId, book }));
      addBookToListInLocalStorage(book, listId);
    } catch (error: any) {
      Logger.error("Failed to add book to list", error);
      throw error;
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
      deleteBookFromListInLocalStorage(listId, bookId);
    } catch (error: any) {
      Logger.error("Failed to remove book from list", error);
      throw error;
    }
  };

  const cancelUpdateBookInList = () => {
    updateBookInListCancelToken.cancel("Operation cancelled by user");
  };

  const updateBookInList = async (bookInList: BookInList) => {
    try {
      await axios.patch(`/api/list/book`, bookInList, {
        cancelToken: updateBookInListCancelToken.token,
      });

      dispatch(updateBookInListAction({ bookInList }));
      updateBookInListInLocalStorage(bookInList);
    } catch (error: any) {
      Logger.error("Failed to update book in list", error);
      if (error instanceof CanceledError) {
        console.log("Operation cancelled by user");
        return;
      }
      throw error;
    }
  };

  return {
    booksLists,
    loading: loading,
    loadUserBooksLists,
    createBooksList,
    updateBooksList,
    cancelUpdateBooksList,
    deleteBooksList,
    addBookToList,
    updateBookInList,
    cancelUpdateBookInList,
    removeBookFromList,
  };
};

export default useBooksList;
