// completeUserBookSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store"; // Adjust the import path as necessary
import { Book, GoodreadsData, UserBook, UserBookData } from "@/src/models";
import { compareBooks } from "@/src/models/book";

type UserBookId = number;

interface SetUserBooksLoadingProps {
  loading: boolean;
  dontLoadIfBooksExist?: boolean;
}

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
    setUserBooksLoading: (
      state,
      action: PayloadAction<SetUserBooksLoadingProps>
    ) => {
      if (
        action.payload.dontLoadIfBooksExist &&
        state.userBooksData.length > 0
      ) {
        state.loading = false;
        return;
      }
      state.loading = action.payload.loading;
    },
    addUserBooks: (state, action: PayloadAction<UserBookData[]>) => {
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
      state.userBooksData = action.payload;
      localStorage.setItem("userBooks", JSON.stringify(action.payload));
    },
    updateUserBook: (state, action: PayloadAction<UserBook>) => {
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
    deleteUserBook: (state, action: PayloadAction<UserBookId>) => {
      const index = state.userBooksData.findIndex(
        (userBookData) => userBookData.userBook.userBookId === action.payload
      );
      if (index !== -1) {
        const userBooksDataNew = [...state.userBooksData];
        userBooksDataNew.splice(index, 1);
        state.userBooksData = userBooksDataNew;
      }
      localStorage.setItem("userBooks", JSON.stringify(state.userBooksData));
    },
    updateUserBookGoodreadsData: (
      state,
      action: PayloadAction<{ book: Book; goodreadsData: GoodreadsData }>
    ) => {
      const index = state.userBooksData.findIndex((userBookData) =>
        compareBooks(userBookData.bookData.book, action.payload.book)
      );
      if (index !== -1) {
        state.userBooksData[index].goodreadsData = action.payload.goodreadsData;
      }
      localStorage.setItem("userBooks", JSON.stringify(state.userBooksData));
    },
    updateUserBookData: (state, action: PayloadAction<UserBookData>) => {
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
  deleteUserBook,
  setError,
} = userBooksSlice.actions;

export const selectUserBooks = (state: RootState): userBooksState =>
  state.userBooks;

export default userBooksSlice.reducer;
