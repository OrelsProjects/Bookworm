// completeUserBookSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store"; // Adjust the import path as necessary
import { BooksListData } from "../../../models/booksList";
import { Book } from "../../../models";
import { BookInList, BookInListWithBook } from "../../../models/bookInList";

interface UserListsState {
  booksListsData: BooksListData[];
  loading: boolean;
  error: string | null;
}

const initialState: UserListsState = {
  booksListsData: [],
  loading: false,
  error: null,
};

const booksListsSlice = createSlice({
  name: "booksListsSlice",
  initialState,
  reducers: {
    setBooksLists: (state, action: PayloadAction<BooksListData[]>) => {
      state.booksListsData = action.payload;
    },
    setBooksListsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addBooksList: (state, action: PayloadAction<BooksListData>) => {
      state.booksListsData.unshift(action.payload);
    },
    updateBooksList: (state, action: PayloadAction<BooksListData>) => {
      const index = state.booksListsData.findIndex(
        (list) => list.listId === action.payload.listId
      );
      if (index !== -1) {
        const newListsData = [...state.booksListsData];
        const booksInList = newListsData[index].booksInList;
        newListsData[index] = action.payload;
        newListsData[index].booksInList = booksInList;
        state.booksListsData = newListsData;
      }
    },
    updateBooksInListPositions: (
      state,
      action: PayloadAction<{
        listId: string;
        booksInList: BookInListWithBook[];
      }>
    ) => {
      const index = state.booksListsData.findIndex(
        (list) => list.listId === action.payload.listId
      );
      if (index !== -1) {
        const newListsData = [...state.booksListsData];
        newListsData[index].booksInList = action.payload.booksInList;
        state.booksListsData = newListsData;
      }
    },
    deleteBooksList: (state, action: PayloadAction<string>) => {
      const index = state.booksListsData.findIndex(
        (list) => list.listId === action.payload
      );
      if (index !== -1) {
        state.booksListsData = state.booksListsData.splice(index, 1);
      }
    },
    addBookToList: (state, action: PayloadAction<BookInListWithBook>) => {
      const listIndex = state.booksListsData.findIndex(
        (list) => list.listId === action.payload.listId
      );
      if (listIndex !== -1) {
        const newBooksListData = [...state.booksListsData];
        newBooksListData[listIndex].booksInList?.push(action.payload);
        state.booksListsData = newBooksListData;
      }
    },
    updateBookInList: (
      state,
      action: PayloadAction<{ bookInList: BookInList }>
    ) => {
      const listIndex = state.booksListsData.findIndex(
        (list) => list.listId === action.payload.bookInList.listId
      );
      if (listIndex !== -1) {
        const updatedBooksList = state.booksListsData[
          listIndex
        ].booksInList?.map((book) =>
          book.bookId === action.payload.bookInList.bookId
            ? { ...book, ...action.payload.bookInList }
            : book
        );
        const newBooksListData = [...state.booksListsData];
        newBooksListData[listIndex].booksInList = updatedBooksList;
        state.booksListsData = newBooksListData;
      }
    },
    removeBookFromList: (
      state,
      action: PayloadAction<{ listId: string; bookId: number }>
    ) => {
      const listIndex = state.booksListsData.findIndex(
        (list) => list.listId === action.payload.listId
      );
      if (listIndex !== -1) {
        const newBooksList = state.booksListsData[
          listIndex
        ].booksInList?.filter((book) => book.bookId !== action.payload.bookId);
        state.booksListsData[listIndex].booksInList = newBooksList;
      }
    },
  },
});

export const {
  setBooksLists,
  setBooksListsLoading,
  addBooksList,
  updateBooksList,
  updateBooksInListPositions,
  deleteBooksList,
  addBookToList,
  updateBookInList,
  removeBookFromList,
} = booksListsSlice.actions;

export const selectBooksLists = (state: RootState): UserListsState =>
  state.booksLists;

export default booksListsSlice.reducer;
