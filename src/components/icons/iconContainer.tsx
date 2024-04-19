import React from "react";
import { IconBaseProps } from "react-icons";
import { IconSize, SpecialIconSize, getIconSize } from "../../consts/icon";

export type IconElement = React.ElementType<IconProps>;

export type Icon = {
  Default?: React.ElementType<IconBaseProps>;
  Fill: React.ElementType<IconProps>;
  Outline: React.ElementType<IconProps>;
};

interface IconProps extends IconBaseProps {
  iconSize: IconSize;
  iconClassName?: string;
}

export const IconFill =
  (
    Icon: React.FC<IconBaseProps>,
    specialIcon?: SpecialIconSize,
    iconClassName?: string
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
    specialIcon?: SpecialIconSize,
    iconClassName?: string
  ): React.ElementType<IconProps> =>
  ({ iconSize, ...props }: IconProps) => {
    const { heightPx, widthPx } = getIconSize({ size: iconSize, specialIcon });
    return (
      <div
        className={`rounded-full bg-foreground p-1 ${className}`}
        id={`iconOutline ${Icon.displayName}`}
      >
        <Icon
          {...props}
          style={{
            height: heightPx,
            width: widthPx,
          }}
          className={`text-background ${iconClassName}`}
        />
      </div>
    );
  };
