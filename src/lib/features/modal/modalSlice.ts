// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export enum ModalTypes {
  BOOK_DETAILS = "BOOK_DETAILS",
  BOOKS_LIST_DETAILS = "BOOKS_LIST_DETAILS",
  ADD_BOOK_TO_BACKLOG = "ADD_BOOK_TO_BACKLOG",
  ADD_BOOK_TO_READ_LIST = "ADD_BOOK_TO_READ_LIST",
}

export interface ModalState {
  data?: any;
  type: ModalTypes | null;
  isOpen: boolean;
  error: string | null;
}

const initialState: ModalState = {
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
    showModal: (
      state,
      action: PayloadAction<{ data?: any; type: ModalTypes }>
    ) => {
      if (state.isOpen) return;
      state.data = action.payload.data;
      state.type = action.payload.type;
      state.isOpen = true;
      state.error = null;
    },
    hideModal: (state) => {
      state.isOpen = false;
      state.error = null;
    },
  },
});

export const { showModal, hideModal } = bottomSheetSlice.actions;
export const selectModal = (state: RootState) => state.modal;

export default bottomSheetSlice.reducer;
