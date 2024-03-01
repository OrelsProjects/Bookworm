// completeUserBookSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store"; // Adjust the import path as necessary
import { BooksListData } from "../../../models/booksList";
import { Book } from "../../../models";

export interface UserListsState {
  booksLists: BooksListData[];
  loading: boolean;
  error: string | null;
}

const initialState: UserListsState = {
  booksLists: [],
  loading: false,
  error: null,
};

const booksListsSlice = createSlice({
  name: "booksListsSlice",
  initialState,
  reducers: {
    setBooksLists: (state, action: PayloadAction<BooksListData[]>) => {
      state.booksLists = action.payload;
    },
    setBooksListsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addBooksList: (state, action: PayloadAction<BooksListData>) => {
      state.booksLists.push(action.payload);
    },
    updateBooksList: (state, action: PayloadAction<BooksListData>) => {
      const index = state.booksLists.findIndex(
        (list) => list.listId === action.payload.listId
      );
      if (index !== -1) {
        state.booksLists[index] = action.payload;
      }
    },
    deleteBooksList: (state, action: PayloadAction<string>) => {
      const index = state.booksLists.findIndex(
        (list) => list.listId === action.payload
      );
      if (index !== -1) {
        state.booksLists.splice(index, 1);
      }
    },
    addBookToList: (
      state,
      action: PayloadAction<{ listId: string; book: Book }>
    ) => {
      const listIndex = state.booksLists.findIndex(
        (list) => list.listId === action.payload.listId
      );
      if (listIndex !== -1) {
        state.booksLists[listIndex].booksInList?.push(action.payload.book);
      }
    },
    removeBookFromList: (
      state,
      action: PayloadAction<{ listId: string; bookId: number }>
    ) => {
      const listIndex = state.booksLists.findIndex(
        (list) => list.listId === action.payload.listId
      );
      if (listIndex !== -1) {
        const newBooksList = state.booksLists[listIndex].booksInList?.filter(
          (book) => book.bookId !== action.payload.bookId
        );
        state.booksLists[listIndex].booksInList = newBooksList;
      }
    },
  },
});

export const {
  setBooksLists,
  setBooksListsLoading,
  addBooksList,
  updateBooksList,
  deleteBooksList,
  addBookToList,
  removeBookFromList,
} = booksListsSlice.actions;

export const selectBooksLists = (state: RootState): UserListsState =>
  state.booksLists;

export default booksListsSlice.reducer;
