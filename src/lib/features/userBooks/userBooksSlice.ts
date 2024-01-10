// completeUserBookSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store"; // Adjust the import path as necessary
import { Book, GoodreadsData, UserBook, UserBookData } from "@/src/models";
import { compareBooks } from "@/src/models/book";

interface userBooksState {
  userBooksData: UserBookData[];
  loading: boolean;
  error: string | null;
}

const initialState: userBooksState = {
  userBooksData: [],
  loading: false,
  error: null,
};

const userBooksSlice = createSlice({
  name: "userBooksSlice",
  initialState,
  reducers: {
    setUserBooksLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addUserBooks: (state, action: PayloadAction<UserBookData[]>) => {
      state.loading = false;
      const bookExists = state.userBooksData.some((userBookData) =>
        compareBooks(
          userBookData.bookData.book,
          action.payload[0].bookData.book
        )
      );
      if (!bookExists) {
        state.userBooksData.push(...action.payload);
      }
      localStorage.setItem("userBooks", JSON.stringify(state.userBooksData));
    },
    setUserBooks: (state, action: PayloadAction<UserBookData[]>) => {
      state.loading = false;
      state.userBooksData = action.payload;
      localStorage.setItem("userBooks", JSON.stringify(action.payload));
    },
    updateUserBook: (state, action: PayloadAction<UserBook>) => {
      state.loading = false;
      const index = state.userBooksData.findIndex(
        (userBookData) =>
          userBookData.userBook.userBookId === action.payload.userBookId
      );
      if (index !== -1) {
        const userBooksDataNew = [...state.userBooksData];
        userBooksDataNew[index].userBook = action.payload;
        state.userBooksData = userBooksDataNew;
      }
      localStorage.setItem("userBooks", JSON.stringify(state.userBooksData));
    },
    updateUserBookGoodreadsData: (
      state,
      action: PayloadAction<{ book: Book; goodreadsData: GoodreadsData }>
    ) => {
      state.loading = false;
      const index = state.userBooksData.findIndex((userBookData) =>
        compareBooks(userBookData.bookData.book, action.payload.book)
      );
      if (index !== -1) {
        state.userBooksData[index].goodreadsData = action.payload.goodreadsData;
      }
      localStorage.setItem("userBooks", JSON.stringify(state.userBooksData));
    },
    updateUserBookData: (state, action: PayloadAction<UserBookData>) => {
      state.loading = false;
      const index = state.userBooksData.findIndex(
        (userBookData) =>
          userBookData.userBook.userBookId ===
          action.payload.userBook.userBookId
      );
      if (index !== -1) {
        const userBooksDataNew = [...state.userBooksData];
        userBooksDataNew[index] = action.payload;
        state.userBooksData = userBooksDataNew;
      }
      localStorage.setItem("userBooks", JSON.stringify(state.userBooksData));
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setUserBooksLoading,
  setUserBooks,
  addUserBooks,
  updateUserBook,
  updateUserBookData,
  updateUserBookGoodreadsData,
  setError,
} = userBooksSlice.actions;

export const selectUserBooks = (state: RootState): userBooksState =>
  state.userBooks;

export default userBooksSlice.reducer;
