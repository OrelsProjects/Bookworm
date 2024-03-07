import React from "react";
import { IconBaseProps } from "react-icons";
import { FaBookmark } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import { FaHouse } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaBarsStaggered } from "react-icons/fa6";
import { FaBookMedical } from "react-icons/fa6";
import { FaSliders } from "react-icons/fa6";
import { CiMenuBurger } from "react-icons/ci";
import { MdCancel } from "react-icons/md";

export type Icon = {
  Fill: React.ElementType;
  Outline: React.ElementType;
};

const IconFill =
  (Icon: React.FC<IconBaseProps>): React.ElementType =>
  (props: IconBaseProps) =>
    <Icon {...props} className={`text-primary ${props.className}`} size={40} />;

const IconOutline =
  (Icon: React.FC<IconBaseProps>, className?: string): React.ElementType =>
  (props: IconBaseProps) =>
    (
      <Icon
        {...props}
        className={`text-foreground ${className ?? ""} ${props.className}`}
      />
    );

export const Add: Icon = {
  Fill: IconFill(IoAddCircle),
  Outline: IconOutline(IoAddCircle),
};

export const Bookmark: Icon = {
  Fill: IconFill(FaBookmark),
  Outline: IconOutline(FaBookmark),
};

export const Checkmark: Icon = {
  Fill: IconFill(IoIosCheckmarkCircle),
  Outline: IconOutline(IoIosCheckmarkCircle),
};

export const NavigationHome: Icon = {
  Fill: IconFill(FaHouse),
  Outline: IconOutline(FaHouse, "text-background"),
};

export const NavigationLists: Icon = {
  Fill: IconFill(FaBookMedical),
  Outline: IconOutline(FaBookMedical, "text-background"),
};

export const BurgerMenu: Icon = {
  Fill: IconFill(FaBarsStaggered),
  Outline: IconOutline(FaBarsStaggered),
};

export const BurgerLines: Icon = {
  Fill: IconFill(CiMenuBurger),
  Outline: IconOutline(CiMenuBurger),
};

export const Plus: Icon = {
  Fill: IconFill(FaPlus),
  Outline: IconOutline(FaPlus),
};

export const Sliders: Icon = {
  Fill: IconFill(FaSliders),
  Outline: IconOutline(FaSliders),
};

export const Cancel: Icon = {
  Fill: IconFill(MdCancel),
  Outline: IconOutline(MdCancel),
};
