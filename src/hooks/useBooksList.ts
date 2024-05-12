import { useEffect, useRef, useState } from "react";
import axios, { CanceledError } from "axios";
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
import {
  BooksListData,
  CreateBooksListPayload,
  SafeBooksListData,
} from "../models/booksList";
import { Book, User } from "../models";
import { IResponse } from "../models/dto/response";
import { DuplicateError } from "../models/errors/duplicateError";
import { BookInList, BookInListWithBook } from "../models/bookInList";
import { LoadingError } from "../models/errors/loadingError";
import useBook from "./useBook";
import { CancelError } from "../models/errors/cancelError";
import { useAppDispatch, useAppSelector } from "../lib/hooks";

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
  const dispatch = useAppDispatch();
  const booksLists = useAppSelector(
    (state: RootState) => state.booksLists.booksListsData
  );
  const { recommendationsData } = useAppSelector(
    (state: RootState) => state.recommendations
  );
  const { lists: exploreLists } = useAppSelector((state) => state.explore);

  const [booksListsData, setBooksListsData] = useState<BooksListData[]>([]);
  const { addBook } = useBook();

  const updateBooksListCancelToken = axios.CancelToken.source();

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

  const getBooksList = async (
    listUrl?: string
  ): Promise<SafeBooksListData | undefined> => {
    if (!listUrl) return;
    const userBooksList = booksLists.find((list) =>
      list.publicURL.toLowerCase().includes(listUrl.toLowerCase())
    );
    if (userBooksList) {
      return userBooksList;
    }
    const recommendedBooksList = recommendationsData.find((list) =>
      list.publicURL.toLowerCase().includes(listUrl.toLowerCase())
    );
    if (recommendedBooksList) {
      return recommendedBooksList;
    }

    const exploreBooksList = exploreLists.find((list) =>
      list.publicURL.toLowerCase().includes(listUrl.toLowerCase())
    );
    if (exploreBooksList) {
      return exploreBooksList;
    }

    const urlParams = new URLSearchParams();
    urlParams.append("url", listUrl ?? "");
    const response = await axios.get<IResponse<SafeBooksListData>>(
      "/api/list",
      {
        params: urlParams,
      }
    );
    const bookList = response.data.result;
    return bookList;
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

  const cancelUpdateBooksList = (booksList: BooksListData) => {
    localStorage.setItem(`booksList-${booksList.listId}`, "true");
  };

  const onBooksListUpdated = (booksList: BooksListData) => {
    localStorage.removeItem(`booksList-${booksList.listId}`);
  };

  const isUpdateBooksListCancelled = (booksList: BooksListData) => {
    return localStorage.getItem(`booksList-${booksList.listId}`) === "true";
  };

  const updateBooksList = async (booksListData: BooksListData) => {
    try {
      const { booksInList, ...booksList } = booksListData;
      await axios.patch(`/api/list/`, booksList, {
        cancelToken: updateBooksListCancelToken.token,
      });
      if (isUpdateBooksListCancelled(booksListData)) {
        throw new CanceledError("Operation cancelled by user");
      }
      dispatch(updateBooksListAction(booksListData));
      updateListInLocalStorage(booksListData);
    } catch (error: any) {
      if (error instanceof CanceledError) {
        throw new CancelError("Operation cancelled by user");
      }
      Logger.error("Failed to update books list", error);
      throw error;
    } finally {
      onBooksListUpdated(booksListData);
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

  const cancelUpdateBookInList = (bookInList: BookInList) => {
    localStorage.setItem(`bookInList-${bookInList.bookId}`, "true");
  };

  const onBookInListUpdated = (bookInList: BookInList) => {
    localStorage.removeItem(`bookInList-${bookInList.bookId}`);
  };

  const isUpdateBookInListCancelled = (bookInList: BookInList) => {
    return localStorage.getItem(`bookInList-${bookInList.bookId}`) === "true";
  };

  const updateBookInList = async (bookInList: BookInList) => {
    try {
      updateBookInListInLocalStorage(bookInList);
      await axios.patch(`/api/list/book`, bookInList);
      if (isUpdateBookInListCancelled(bookInList)) {
        throw new CanceledError("Operation cancelled by user");
      }
      dispatch(updateBookInListAction({ bookInList }));
    } catch (error: any) {
      if (error instanceof CanceledError) {
        throw new CancelError("Operation cancelled by user");
      }
      Logger.error("Failed to update book in list", error);
      throw error;
    } finally {
      onBookInListUpdated(bookInList);
    }
  };

  return {
    booksLists: booksListsData,
    loading: loading,
    loadUserBooksLists,
    getBooksList,
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

/**
 * 
 
 */
