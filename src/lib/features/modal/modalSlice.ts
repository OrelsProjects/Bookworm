// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store"; // Adjust the import path as necessary
import { Book } from "../../../models";
import UserBook, { BookData } from "@/src/models/userBook";

export enum ModalTypes {
  BOOK_DETAILS = "BOOK_DETAILS",
  ADD_BOOK_TO_BACKLOG = "ADD_BOOK_TO_BACKLOG",
  ADD_BOOK_TO_READ_LIST = "ADD_BOOK_TO_READ_LIST",
  IMPORT_BOOKS = "IMPORT_BOOKS",
}

const testBook = new Book(
  "Think Like a Monk", // title
  1, // mainGenreId (placeholder)
  123, // bookId (placeholder)
  "http://books.google.com/books/content?id=N-T7DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api", // thumbnailUrl
  undefined, // subtitle (not provided in the data)
  undefined, // originalDatePublished (not provided in the data)
  undefined, // numberOfPages (not provided in the data)
  undefined, // mediumImageUrl (explicitly null in the data)
  "en", // language
  "1982134488", // isbn10
  "9781982134488", // isbn
  undefined, // datePublished (not provided in the data)
  ["Jay Shetty"], // authors
  "Jay Shetty, social media superstar and host of the #1 podcast On Purpose, distills the timeless wisdom he learned as a monk into practical steps anyone can take every day to live a less anxious, more meaningful life. [...]" // description (truncated for brevity)
);

export interface ModalState {
  data: Book | any | null;
  type: ModalTypes | null;
  error: string | null;
}

const initialState: ModalState = {
  data: null,
  type: null,
  // data: testBook,
  // type: ModalTypes.ADD_BOOK_TO_BACKLOG,
  error: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal: (
      state,
      action: PayloadAction<{ book?: Book; type: ModalTypes }>
    ) => {
      state.data = action.payload.book;
      state.type = action.payload.type;
      state.error = null;
    },
    showAddToReadListModal: (state, action: PayloadAction<UserBook>) => {
      state.data = action.payload;
      state.type = ModalTypes.ADD_BOOK_TO_READ_LIST;
      state.error = null;
    },
    hideModal: (state) => {
      state.type = null;
      state.error = null;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export const selectModal = (state: RootState) => state.modal;

export default modalSlice.reducer;
