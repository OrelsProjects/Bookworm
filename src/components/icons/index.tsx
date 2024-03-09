import React from "react";
import { IconBaseProps } from "react-icons";
import { FaBookmark, FaShare } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import {
  FaHouse,
  FaPlus,
  FaBarsStaggered,
  FaBookMedical,
} from "react-icons/fa6";
import { FaSliders } from "react-icons/fa6";
import { CiMenuBurger } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { GiCircle } from "react-icons/gi";
import { IconSize, SpecialIconSize, getIconSize } from "../../consts/icon";

export type Icon = {
  Fill: React.ElementType<IconProps>;
  Outline: React.ElementType<IconProps>;
};

interface IconProps extends IconBaseProps {
  iconSize: IconSize;
}

const IconFill =
  (
    Icon: React.FC<IconBaseProps>,
    specialIcon?: SpecialIconSize
  ): React.ElementType<IconProps> =>
  ({ iconSize, ...props }: IconProps) => {
    const { heightPx, widthPx } = getIconSize({ size: iconSize, specialIcon });

    return (
      <Icon
        {...props}
        style={{
          height: heightPx,
          width: widthPx,
        }}
        className={`text-primary ${props.className} !w-[${widthPx}] !h-[${heightPx}]`}
      />
    );
  };

const IconOutline =
  (
    Icon: React.FC<IconBaseProps>,
    className?: string,
    specialIcon?: SpecialIconSize
  ): React.ElementType<IconProps> =>
  ({ iconSize, ...props }: IconProps) => {
    const { heightPx, widthPx } = getIconSize({ size: iconSize, specialIcon });
    return (
      <Icon
        {...props}
        style={{
          height: heightPx,
          width: widthPx,
        }}
        className={`text-foreground ${className ?? ""} ${props.className}`}
      />
    );
  };

export const Add: Icon = {
  Fill: IconFill(IoAddCircle),
  Outline: IconOutline(IoAddCircle),
};

export const Bookmark: Icon = {
  Fill: IconFill(FaBookmark, SpecialIconSize.Bookmark),
  Outline: IconOutline(FaBookmark, SpecialIconSize.Bookmark),
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

export const Circle: Icon = {
  Fill: IconFill(GiCircle),
  Outline: IconOutline(GiCircle),
};

export const Share: Icon = {
  Fill: IconFill(FaShare),
  Outline: IconOutline(FaShare),
};
