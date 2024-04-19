// recommendationsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { SafeBooksListData } from '../../../models/booksList';

interface RecommendationsState {
  recommendationsData: SafeBooksListData[];
  loading: boolean;
  error: string | null;
}

const initialState: RecommendationsState = {
  recommendationsData: [],
  loading: false,
  error: null,
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setRecommendations: (state, action: PayloadAction<SafeBooksListData[]>) => {
      state.recommendationsData = action.payload;
    },
    setRecommendationsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setRecommendations, setRecommendationsLoading, setError } = recommendationsSlice.actions;

export const selectRecommendations = (state: RootState): RecommendationsState => state.recommendations;

export default recommendationsSlice.reducer;
