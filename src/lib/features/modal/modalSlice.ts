// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export interface ShowModalOptions {
  popLast?: boolean;
  shouldAnimate?: boolean;
  onBack?: () => void;
  loading?: boolean;
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

const canSetNewModal = (
  newState: ModalState,
  newType: ModalTypes,
  newOptions?: ShowModalOptions
) => {
  // No modal is shown
  if (newState.modalStack.length === 0) {
    return true;
  }
  const modalOnTop: ModalData | undefined =
    newState.modalStack[newState.modalStack.length - 1];
  const isLoadingModalOnTop = modalOnTop?.options?.loading;
  const isNewModalOnTop =
    newState.modalStack.length > 0 && modalOnTop?.type === newType;

  // If the new modal is not the one on top, show it
  if (!isNewModalOnTop) {
    return true;
  }
  // From here, we know that the new modal is the one on top

  // If the modal on top is a loading modal, show the new modal if it's not a loading modal
  if (isLoadingModalOnTop && !newOptions?.loading) {
    return true;
  }
  // If popLast option is false, don't show it again
  if (newOptions?.popLast) {
    return true;
  }
  return false;
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
      if (!canSetNewModal(state, action.payload.type, action.payload.options)) {
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
