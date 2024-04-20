import { useEffect, useRef, useState } from "react";
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
  updateBooksInListPositions as updateBooksInListPositionsAction,
} from "../lib/features/booksLists/booksListsSlice";
import { BooksListData, CreateBooksListPayload } from "../models/booksList";
import { Book, User } from "../models";
import { IResponse } from "../models/dto/response";
import { DuplicateError } from "../models/errors/duplicateError";
import { BookInList, BookInListWithBook } from "../models/bookInList";
import { LoadingError } from "../models/errors/loadingError";
import useBook from "./useBook";

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

const addBookToListInLocalStorage = (bookInList: BookInListWithBook) => {
  const booksListData: BooksListData[] = getBooksListFromLocalStorage();
  booksListData?.forEach((list) => {
    if (list.listId === bookInList.listId) {
      list.booksInList?.push(bookInList);
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
  const [booksListsData, setBooksListsData] = useState<BooksListData[]>([]);
  const { addBook } = useBook();
  const updateBooksListCancelToken = axios.CancelToken.source();
  const updateBookInListCancelToken = axios.CancelToken.source();

  useEffect(() => {
    const sortedBooksInList = booksLists.map((list) => {
      const booksInList = [...(list.booksInList ?? [])];
      const sortedBooksInList = booksInList?.sort((a, b) => {
        return (a.position ?? 0) - (b.position ?? 0);
      });
      return { ...list, booksInList: sortedBooksInList };
    });
    setBooksListsData(sortedBooksInList);
  }, [booksLists]);

  useEffect(() => {
    localStorage.removeItem("booksList");
  }, []);

  const sortByPosition = (
    booksList?: BooksListData
  ): BooksListData | undefined => {
    if (!booksList) {
      return booksList;
    }
    let sortedBooksInList = [...(booksList.booksInList ?? [])];
    sortedBooksInList.sort((a, b) => {
      return (a.position ?? 0) - (b.position ?? 0);
    });
    return { ...booksList, booksInList: sortedBooksInList };
  };

  const searchInBooksList = (searchTerm: string) => {
    const newList = booksLists.filter((list) =>
      list.booksInList?.some(
        (bookInList) =>
          bookInList.book.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          bookInList.book.authors?.some((author) =>
            author.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    );
    setBooksListsData(newList);
  };

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

      const response = await axios.get<IResponse<BooksListData[]>>(
        "/api/lists"
      );
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

  const updateBooksInListPositions = async (booksListData: BooksListData) => {
    try {
      await axios.patch(
        `/api/book-in-list/`,
        { booksInList: [...booksListData.booksInList] },
        {
          cancelToken: updateBooksListCancelToken.token,
        }
      );
      dispatch(
        updateBooksInListPositionsAction({
          booksInList: booksListData.booksInList,
          listId: booksListData.listId,
        })
      );
      updateListInLocalStorage(booksListData);
    } catch (error: any) {
      Logger.error("Failed to update books list", error);
      throw error;
    }
  };

  const updateBooksInList = async (booksListData: BooksListData) => {
    try {
      await axios.patch(
        `/api/book-in-list/`,
        { booksInList: [...booksListData.booksInList] },
        {
          cancelToken: updateBooksListCancelToken.token,
        }
      );
      dispatch(updateBooksInListPositionsAction(booksListData));
      updateListInLocalStorage(booksListData);
    } catch (error: any) {
      Logger.error("Failed to update books list", error);
      throw error;
    }
  };

  const deleteBooksList = async (listId: string) => {
    if (loading.current) {
      throw new LoadingError(
        "Operation in progress. Please wait until the current operation completes."
      );
    }
    loading.current = true;
    try {
      await axios.delete(`/api/list/${listId}`);
      dispatch(deleteBooksListAction(listId));
      deleteListInLocalStorage(listId);
    } catch (error: any) {
      Logger.error("Failed to delete books list", error);
      throw error;
    } finally {
      loading.current = false;
    }
  };

  const addBookToList = async (
    listId: string,
    book: Book,
    comments?: string
  ) => {
    if (loading.current) {
      throw new LoadingError(
        "Operation in progress. Please wait until the current operation completes."
      );
    }
    loading.current = true;
    try {
      let newBook = { ...book };
      if (!book.bookId) {
        newBook = await addBook(book);
      }
      const response = await axios.post<BookInList>(`/api/list/book`, {
        listId,
        bookId: newBook.bookId,
        comments,
      });
      const bookInList = response.data;
      const bookInListWithBook = { ...bookInList, book };

      dispatch(addBookToListAction(bookInListWithBook));
      addBookToListInLocalStorage(bookInListWithBook);
    } catch (error: any) {
      Logger.error("Failed to add book to list", error);
      throw error;
    } finally {
      loading.current = false;
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
        return;
      }
      throw error;
    }
  };

  return {
    booksLists: booksListsData,
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
    searchInBooksList,
    updateBooksInList,
    updateBooksInListPositions,
    sortByPosition,
  };
};

export default useBooksList;
