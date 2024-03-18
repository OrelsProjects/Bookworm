import { GrCheckmark } from "react-icons/gr";
import { Icon, IconFill, IconOutline } from "./iconContainer";

export const Checkmark: Icon = {
  Default: GrCheckmark,
  Fill: IconFill(GrCheckmark),
  Outline: IconOutline(GrCheckmark),
};
