// recommendationsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { SafeBooksListData } from "../../../models/booksList";

/**
 *   const [lastPageReached, setLastPageReached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(false);
 */
interface ExploreState {
  lists: SafeBooksListData[];
  genres: string[];
  selectedGenre?: string;
  loading: boolean;
  loadingGenres: boolean;
  loadingNewPage: boolean;
  page: number;
  lastPageReached: boolean;
}

const initialState: ExploreState = {
  lists: [],
  genres: [],
  selectedGenre: undefined,
  loading: false,
  loadingGenres: false,
  loadingNewPage: false,
  page: 1,
  lastPageReached: false,
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoadingGenres: (state, action: PayloadAction<boolean>) => {
      state.loadingGenres = action.payload;
    },
    setLoadingNewPage: (state, action: PayloadAction<boolean>) => {
      state.loadingNewPage = action.payload;
    },
    nextPage: (state) => {
      if (state.lastPageReached) return;
      if (state.loadingNewPage) return;
      if (state.loading) return;
      state.page += 1;
    },
    reset: (state) => {
      state.page = 1;
      state.loading = false;
      state.loadingNewPage = false;
      state.lastPageReached = false;
    },
    setLastPageReached: (state, action: PayloadAction<boolean>) => {
      state.lastPageReached = action.payload;
    },
  },
});

export const {
  setLists,
  setSelectedGenre,
  setGenres,
  setLoading,
  setLoadingGenres,
  setLoadingNewPage,
  nextPage,
  reset,
  setLastPageReached,
} = exploreSlice.actions;

export const selectRecommendations = (state: RootState): ExploreState =>
  state.explore;

export default exploreSlice.reducer;
