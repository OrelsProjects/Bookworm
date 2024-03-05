import { Icon, NavigationHome, NavigationLists } from "../icons";

export type BottomBarItem = {
  name: string;
  icon: Icon;
  path: string;
  className?: string;
};

export const bottomBarItems: BottomBarItem[] = [
  {
    name: "Home",
    icon: NavigationHome,
    path: "/home",
    className: "w-7 h-6",
  },
  {
    name: "My lists",
    icon: NavigationLists,
    path: "/my-lists",
    className: "!w-5 !h-6",
  },
];
