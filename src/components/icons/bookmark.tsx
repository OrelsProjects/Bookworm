import { FaBookmark } from "react-icons/fa";
import { SpecialIconSize } from "../../consts/icon";
import { Icon, IconFill, IconOutline } from "./iconContainer";

export const Bookmark: Icon = {
    Fill: IconFill(FaBookmark, SpecialIconSize.Bookmark),
    Outline: IconOutline(FaBookmark, SpecialIconSize.Bookmark),
  };