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
import { IconSize, SpecialIconSize, getIconSize } from "../../consts/icon";

export type Icon = {
  Fill: React.ElementType<IconProps>;
  Outline: React.ElementType<IconProps>;
};

interface IconProps extends IconBaseProps {
  size: IconSize;
}

const IconFill =
  (
    Icon: React.FC<IconBaseProps>,
    specialIcon?: SpecialIconSize
  ): React.ElementType<IconProps> =>
  ({ size: iconSize, ...props }: IconProps) =>
    (
      <Icon
        {...props} // Override with actual props passed to the component
        className={`text-primary ${
          getIconSize({
            iconSize,
            specialIcon,
          }).className
        } ${props.className}`}
      />
    );

// Enhanced IconOutline function to accept and apply defaultProps
const IconOutline =
  (
    Icon: React.FC<IconBaseProps>,
    className?: string,
    specialIcon?: SpecialIconSize
  ): React.ElementType<IconProps> =>
  ({ size: iconSize, ...props }: IconProps) =>
    (
      <Icon
        {...props}
        className={`text-foreground ${
          getIconSize({
            iconSize,
            specialIcon,
          }).className
        } ${className ?? ""} ${props.className}`}
      />
    );
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
