import { useEffect, useRef } from "react";
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
import { Book, User } from "../models";
import { IResponse } from "../models/dto/response";
import { DuplicateError } from "../models/errors/duplicateError";

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

const updateListInLocalStorage = (booksList: BooksList) => {
  const booksListData = getBooksListFromLocalStorage();
  const index = booksListData.findIndex(
    (list) => list.listId === booksList.listId
  );
  if (index !== -1) {
    booksListData[index] = booksList;
  }
  setListInLocalStorage(booksListData);
};

const useBooksList = () => {
  const loading = useRef(false);
  const dispatch = useDispatch();
  const booksLists = useSelector(
    (state: RootState) => state.booksLists.booksListsData
  );

  useEffect(() => {
    localStorage.removeItem("booksList");
  }, []);

  const loadUserBooksLists = async (user?: User | null) => {
    if (loading.current) {
      throw new Error(
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

      const response = await axios.get<IResponse<BooksListData[]>>("/api/list");
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

  const updateBooksList = async (booksList: BooksList) => {
    try {
      await axios.patch(`/api/list/`, booksList);
      dispatch(updateBooksListAction(booksList));
      updateListInLocalStorage(booksList);
    } catch (error: any) {
      Logger.error("Failed to update books list", error);
    }
  };

  const deleteBooksList = async (listId: string) => {
    try {
      await axios.delete(`/api/list/${listId}`);
      dispatch(deleteBooksListAction(listId));
      deleteListInLocalStorage(listId);
    } catch (error: any) {
      Logger.error("Failed to delete books list", error);
    }
  };

  const addBookToList = async (listId: string, book: Book) => {
    try {
      await axios.post(`/api/list/book`, {
        listId,
        bookId: book.bookId,
      });
      dispatch(addBookToListAction({ listId, book }));
      const booksList: BooksListData = booksLists.find(
        (list) => list.listId === listId
      ) as BooksListData;
      booksList?.booksInList?.push({
        book: { ...book },
        listId: listId,
        bookId: book.bookId,
      });

      addBookToListInLocalStorage(book, listId);
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
      deleteBookFromListInLocalStorage(listId, bookId);
    } catch (error: any) {
      Logger.error("Failed to remove book from list", error);
    }
  };

  return {
    booksLists,
    loading: loading,
    loadUserBooksLists,
    createBooksList,
    updateBooksList,
    deleteBooksList,
    addBookToList,
    removeBookFromList,
  };
};

export default useBooksList;
