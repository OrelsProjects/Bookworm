import React from "react";
import { IconSize } from "../../consts/icon";
import { FaBookMedical } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { IconBaseProps } from "react-icons";
import { FaSearch } from "react-icons/fa";

export type NavigationBarItem = {
  name: string;
  icon: (props: IconBaseProps) => JSX.Element;
  iconSelected: (props: IconBaseProps) => JSX.Element;
  path: string;
  size: IconSize;
  className?: string;
};

export const navigationBarItems: NavigationBarItem[] = [
  {
    name: "Home",
    icon: FaHouse,
    iconSelected: FaHouse,
    path: "/home",
    size: "sm",
  },
  {
    name: "Explore",
    icon: FaSearch,
    iconSelected: FaSearch,
    path: "/explore",
    size: "sm",
  },
  {
    name: "Lists",
    icon: FaBookMedical,
    iconSelected: FaBookMedical,
    path: "/lists",
    className: "p-[1px] mt-0.5",
    size: "sm",
  },
];
