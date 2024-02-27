import { Icon, NavigationHome, NavigationLists } from "../icons";

export type BottomBarItem = {
  name: string;
  icon: Icon;
  path: string;
};

export const bottomBarItems: BottomBarItem[] = [
  {
    name: "Home",
    icon: NavigationHome,
    path: "/home",
  },
  {
    name: "Search",
    icon: NavigationLists,
    path: "/my-lists",
  },
];
