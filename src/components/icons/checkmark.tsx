import { FaCheck } from "react-icons/fa6";
import { Icon, IconFill, IconOutline } from "./iconContainer";

export const Checkmark: Icon = {
  Default: FaCheck,
  Fill: IconFill(FaCheck),
  Outline: IconOutline(FaCheck),
};
