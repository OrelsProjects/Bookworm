// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store"; // Adjust the import path as necessary
import { User } from "../../../models";
import { isEqual } from "lodash";

type LoadingState = {
  loading: boolean;
  message?: string;
};

export enum AuthStateType {
  SIGNED_IN = "SIGNED_IN",
  SIGNED_OUT = "SIGNED_OUT",
}

interface AuthState {
  user: User | null;
  error: string | null;
  state: AuthStateType;
  allDataFetched: boolean;
  loadingState: LoadingState;
}

const initialState: AuthState = {
  user: null,
  state: AuthStateType.SIGNED_OUT,
  loadingState: {
    loading: true,
    message: "",
  },
  error: null,
  allDataFetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      const currentUser = state.user;
      if (isEqual(currentUser, action.payload)) {
        return;
      }
      state.user = action.payload;
      state.state = action.payload
        ? AuthStateType.SIGNED_IN
        : AuthStateType.SIGNED_OUT;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<LoadingState>) => {
      if (action.payload) {
        state.error = null;
      }
      state.loadingState = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.state = AuthStateType.SIGNED_OUT;
      state.error = null;
      state.allDataFetched = false;
    },
    setAllDataFetched: (state) => {
      state.allDataFetched = true;
    },
  },
});

export const { setUser, clearUser, setLoading, setError, setAllDataFetched } =
  authSlice.actions;

export const selectAuth = (state: RootState): AuthState => state.auth;

export default authSlice.reducer;
