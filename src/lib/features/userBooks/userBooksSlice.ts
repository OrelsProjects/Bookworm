// completeUserBookSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store"; // Adjust the import path as necessary
import UserBookData from "@/src/models/userBookData";

interface userBooksState {
  data: UserBookData[] | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
}

const initialState: userBooksState = {
  data: null,
  loading: true,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalRecords: 0,
};

const userBooksSlice = createSlice({
  name: "userBooksSlice",
  initialState,
  reducers: {
    setCompleteUserBook: (
      state,
      action: PayloadAction<UserBookData[] | null>
    ) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setTotalRecords: (state, action: PayloadAction<number>) => {
      state.totalRecords = action.payload;
    },
  },
});

export const {
  setCompleteUserBook,
  setLoading,
  setError,
  setCurrentPage,
  setPageSize,
  setTotalRecords,
} = userBooksSlice.actions;

export const selectCompleteUserBook = (state: RootState): userBooksState =>
  state.userBooks;

export default userBooksSlice.reducer;
