import { createContext } from "react";
import { ModalTypes } from "../features/modal/modalSlice";

type ModalContextType = Record<ModalTypes, string>;

const createDefaultValues = (): ModalContextType => {
  return Object.values(ModalTypes).reduce((acc, modalType) => {
    acc[modalType] = "rgb(225,225,225)";
    return acc;
  }, {} as ModalContextType);
};

const ModalContext = createContext<ModalContextType>(createDefaultValues());

export default ModalContext;
