import React from "react";
import { IconBaseProps } from "react-icons";
import { IconSize, SpecialIconSize, getIconSize } from "../../consts/icon";

export type Icon = {
  Fill: React.ElementType<IconProps>;
  Outline: React.ElementType<IconProps>;
};

interface IconProps extends IconBaseProps {
  iconSize: IconSize;
}

export const IconFill =
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

export const IconOutline =
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
