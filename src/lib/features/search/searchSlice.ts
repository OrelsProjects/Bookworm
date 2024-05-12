// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { SearchResults, SearchStatus } from "../../../models/search";
import { SafeBooksListData } from "../../../models/booksList";
import { Book } from "../../../models";

interface SearchState {
  status: SearchStatus;
  books: Book[] | null;
  lists: SafeBooksListData[] | null;
}

const initialState: SearchState = {
  status: "idle",
  books: null,
  lists: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchResults(
      state,
      action: PayloadAction<{ results: SearchResults | null }>
    ) {
      state.books = action.payload.results?.books || null;
      state.lists = action.payload.results?.lists || null;
      if ((state.books?.length || 0) > 0 || (state.lists?.length || 0) > 0) {
        state.status = "results";
      } else {
        state.status = "no-results";
      }
    },
    setStatus(state, action: PayloadAction<SearchStatus>) {
      state.status = action.payload;
    },
    clearResults(state) {
      state.books = null;
      state.lists = null;
      state.status = "idle";
    },
  },
});

export const { setSearchResults, setStatus, clearResults } =
  searchSlice.actions;
export const selectModal = (state: RootState) => state.modal;

export default searchSlice.reducer;
