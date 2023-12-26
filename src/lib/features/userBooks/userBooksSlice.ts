// completeUserBookSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store"; // Adjust the import path as necessary
import { UserBook, UserBookData } from "@/src/models";

interface userBooksState {
  userBooksData: UserBookData[];
  error: string | null;
}

const initialState: userBooksState = {
  userBooksData: [],
  error: null,
};

const userBooksSlice = createSlice({
  name: "userBooksSlice",
  initialState,
  reducers: {
    addUserBooks: (state, action: PayloadAction<UserBookData[]>) => {
      state.userBooksData.push(...action.payload);
    },
    updateUserBook: (state, action: PayloadAction<UserBook>) => {
      const index = state.userBooksData.findIndex(
        (userBookData) =>
          userBookData.userBook.userBookId === action.payload.userBookId
      );
      if (index !== -1) {
        state.userBooksData[index].userBook = action.payload;
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addUserBooks, updateUserBook, setError } = userBooksSlice.actions;

export const selectUserBooks = (state: RootState): userBooksState =>
  state.userBooks;

export default userBooksSlice.reducer;
