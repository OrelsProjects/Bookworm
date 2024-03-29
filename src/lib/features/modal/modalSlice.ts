// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export interface ShowModalOptions {
  popLast?: boolean;
  shouldAnimate?: boolean;
}

export enum ModalTypes {
  BOOK_DETAILS = "BOOK_DETAILS",
  BOOKS_LIST_DETAILS = "BOOKS_LIST_DETAILS",
  BOOKS_LIST_DETAILS_EDIT = "BOOKS_LIST_DETAILS_EDIT",
  ADD_BOOK_TO_LIST = "ADD_BOOK_TO_LIST",
  REGISTER = "REGISTER",
}

export interface ModalData {
  data?: any;
  type: ModalTypes;
  options?: ShowModalOptions;
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
      action: PayloadAction<{
        type: ModalTypes;
        data?: any;
        options?: ShowModalOptions;
      }>
    ) => {
      const isModalOnTop =
        state.modalStack.length > 0 &&
        state.modalStack[state.modalStack.length - 1].type ===
          action.payload.type;
      if (isModalOnTop) {
        return;
      }
      if (action.payload.options?.popLast) {
        state.modalStack.pop();
      }
      state.modalStack.push(action.payload);
      state.error = null;
    },
    clearStack: (state) => {
      state.modalStack = [];
      state.error = null;
    },
    hideModal: (state) => {
      state.modalStack.pop();
      state.error = null;
    },
  },
});

export const { showModal, clearStack, hideModal } = bottomSheetSlice.actions;
export const selectModal = (state: RootState) => state.modal;

export default bottomSheetSlice.reducer;
