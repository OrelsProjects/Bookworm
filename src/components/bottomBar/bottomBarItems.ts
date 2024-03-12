import { IconSize } from "../../consts/icon";
import { Icon, NavigationHome, NavigationLists } from "../icons";

export type BottomBarItem = {
  name: string;
  icon: Icon;
  path: string;
  size: IconSize;
  className?: string;
};

export const bottomBarItems: BottomBarItem[] = [
  {
    name: "Home",
    icon: NavigationHome,
    path: "/home",
    size: "sm",
  },
  {
    name: "My lists",
    icon: NavigationLists,
    path: "/my-lists",
    className: "p-0.5 mt-0.5",
    size: "sm",
  },
];
