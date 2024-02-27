// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { Book } from "../../../models";

export enum BottomSheetTypes {
  BOOK_DETAILS = "BOOK_DETAILS",
  ADD_BOOK_TO_BACKLOG = "ADD_BOOK_TO_BACKLOG",
  ADD_BOOK_TO_READ_LIST = "ADD_BOOK_TO_READ_LIST",
}

export interface BottomSheetState {
  data?: Book;
  type: BottomSheetTypes | null;
  isOpen: boolean;
  error: string | null;
}

const initialState: BottomSheetState = {
  data: undefined,
  type: null,
  isOpen: false,
  // data: testBook,
  // type: ModalTypes.ADD_BOOK_TO_BACKLOG,
  error: null,
};

const bottomSheetSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showBottomSheet: (
      state,
      action: PayloadAction<{ book?: Book; type: BottomSheetTypes }>
    ) => {
      state.data = action.payload.book;
      state.type = action.payload.type;
      state.isOpen = true;
      state.error = null;
    },
    hideBottomSheet: (state) => {
      state.isOpen = false;
      state.error = null;
    },
  },
});

export const { showBottomSheet, hideBottomSheet } = bottomSheetSlice.actions;
export const selectModal = (state: RootState) => state.modal;

export default bottomSheetSlice.reducer;
