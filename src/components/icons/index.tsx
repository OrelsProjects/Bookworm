import React from "react";
import { IconBaseProps } from "react-icons";
import { FaBookmark } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import { TiHome, TiHomeOutline } from "react-icons/ti";
import { LuBookPlus } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";


export type Icon = {
  Fill: React.ElementType;
  Outline: React.ElementType;
};

const IconFill =
  (Icon: React.FC<IconBaseProps>): React.ElementType =>
  (props: IconBaseProps) =>
    <Icon {...props} className={`text-primary ${props.className}`} />;

const IconOutline =
  (Icon: React.FC<IconBaseProps>, className?: string): React.ElementType =>
  (props: IconBaseProps) =>
    (
      <Icon
        {...props}
        className={`text-foreground ${className} ${props.className}`}
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
  Fill: IconFill(TiHome),
  Outline: IconOutline(TiHomeOutline),
};

export const NavigationLists: Icon = {
  Fill: IconFill(LuBookPlus),
  Outline: IconOutline(LuBookPlus, "text-background"),
};

export const Plus: Icon = {
  Fill: IconFill(FaPlus),
  Outline: IconOutline(FaPlus),
};
