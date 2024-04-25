// recommendationsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { SafeBooksListData } from "../../../models/booksList";

interface ExploreState {
  lists: SafeBooksListData[];
  genres: string[];
  selectedGenre?: string;
}

const initialState: ExploreState = {
  lists: [],
  genres: [],
  selectedGenre: undefined,
};

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<SafeBooksListData[]>) => {
      state.lists = action.payload || [];
    },
    setGenres: (state, action: PayloadAction<string[]>) => {
      state.genres = action.payload || [];
    },
    setSelectedGenre: (state, action: PayloadAction<string>) => {
      state.selectedGenre = action.payload;
    },
  },
});

export const { setLists, setSelectedGenre, setGenres } = exploreSlice.actions;

export const selectRecommendations = (state: RootState): ExploreState =>
  state.explore;

export default exploreSlice.reducer;
