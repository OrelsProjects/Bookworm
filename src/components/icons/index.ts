import { IconBaseProps } from "react-icons";
import {
  FaBookmark as BookmarkFill,
  FaRegBookmark as Bookmark,
} from "react-icons/fa";
import {
  IoIosCheckmarkCircleOutline as Checkmark,
  IoIosCheckmarkCircle as CheckmarkFill,
} from "react-icons/io";
import {
  IoAddCircleOutline as AddCircle,
  IoAddCircle as AddCircleFill,
} from "react-icons/io5";

export type Icon = {
  fill: React.FC<IconBaseProps>;
  outline: React.FC<IconBaseProps>;
};

const addCircle: Icon = {
  fill: AddCircleFill,
  outline: AddCircle,
};

const bookmark: Icon = {
  fill: BookmarkFill,
  outline: Bookmark,
};

const checkmark: Icon = {
  fill: CheckmarkFill,
  outline: Checkmark,
};

export { addCircle, bookmark, checkmark };
