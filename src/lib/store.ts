import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import userBooksReducer from "./features/userBooks/userBooksSlice";
import modalReducer from "./features/modal/modalSlice";
import booksListsReducer from "./features/booksLists/booksListsSlice";
import recommendationsReducer from "./features/recommendations/recommendationsSlice";
import exploreReducer from "./features/explore/exploreSlice";
import searchReducer from "./features/search/searchSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      userBooks: userBooksReducer,
      modal: modalReducer,
      booksLists: booksListsReducer,
      recommendations: recommendationsReducer,
      explore: exploreReducer,
      search: searchReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
