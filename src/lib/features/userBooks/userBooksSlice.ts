// completeUserBookSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store"; // Adjust the import path as necessary
import { CompleteBookData } from "../../../types/completeData";

interface userBooksState {
  data: CompleteBookData[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: userBooksState = {
  data: null,
  loading: true,
  error: null,
};

const userBooksSlice = createSlice({
  name: "userBooksSlice",
  initialState,
  reducers: {
    setCompleteUserBook: (
      state,
      action: PayloadAction<CompleteBookData[] | null>
    ) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCompleteUserBook, setLoading, setError } =
  userBooksSlice.actions;

export const selectCompleteUserBook = (state: RootState): userBooksState =>
  state.userBooks;

export default userBooksSlice.reducer;
