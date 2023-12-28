// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store"; // Adjust the import path as necessary
import { Book } from "../../../models";

export enum ModalTypes {
  BOOK_DETAILS = "BOOK_DETAILS",
}

export interface ModalState {
  data: Book | any | null;
  type: ModalTypes;
  error: string | null;
}

const initialState: ModalState = {
  data: null,
  type: ModalTypes.BOOK_DETAILS,
  error: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showBookDetailsModal: (state, action: PayloadAction<Book>) => {
      state.data = action.payload;
      state.type = ModalTypes.BOOK_DETAILS;
      state.error = null;
    },
    hideModal: (state) => {
      state.data = null;
      state.error = null;
    },
  },
});

export const { showBookDetailsModal, hideModal } = modalSlice.actions;
export const selectModal = (state: RootState) => state.modal;

export default modalSlice.reducer;
