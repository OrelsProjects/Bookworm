import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import userBooksReducer from "./features/userBooks/userBooksSlice";
import modalReducer from "./features/modal/modalSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      userBooks: userBooksReducer,
      modal: modalReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
