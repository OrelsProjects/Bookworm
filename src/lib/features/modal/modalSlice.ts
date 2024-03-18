// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export enum ModalTypes {
  BOOK_DETAILS = "BOOK_DETAILS",
  BOOKS_LIST_DETAILS = "BOOKS_LIST_DETAILS",
  BOOKS_LIST_DETAILS_EDIT = "BOOKS_LIST_DETAILS_EDIT",
  ADD_BOOK_TO_LIST = "ADD_BOOK_TO_LIST",
}

export interface ModalData {
  data?: any;
  type: ModalTypes;
}

export interface ModalState {
  modalStack: ModalData[];
  error: string | null;
}

const initialState: ModalState = {
  modalStack: [],
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
      state.modalStack.push(action.payload);
      state.error = null;
    },
    hideModal: (state) => {
      state.modalStack.pop();
      state.error = null;
    },
  },
});

export const { showModal, hideModal } = bottomSheetSlice.actions;
export const selectModal = (state: RootState) => state.modal;

export default bottomSheetSlice.reducer;
