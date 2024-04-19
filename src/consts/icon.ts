export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export enum SpecialIconSize {
  Bookmark = "bookmark",
}

const specialIconSizes = {
  [SpecialIconSize.Bookmark]: {
    xs: {
      width: "w-3",
      height: "h-4",
      widthPx: 12,
      heightPx: 16,
      widthRem: 0.75,
      heightRem: 1,
    },
    sm: {
      width: "w-5",
      height: "h-6",
      widthPx: 20,
      heightPx: 24,
      widthRem: 1.25,
      heightRem: 1.5,
    },
    md: {
      width: "w-7",
      height: "h-8",
      widthPx: 28,
      heightPx: 32,
      widthRem: 1.75,
      heightRem: 2,
    },
    lg: {
      width: "w-8",
      height: "h-9",
      widthPx: 32,
      heightPx: 36,
      widthRem: 2,
      heightRem: 2.25,
    },
    xl: {
      width: "w-11",
      height: "h-12",
      widthPx: 44,
      heightPx: 48,
      widthRem: 2.75,
      heightRem: 3,
    },
  },
};

const iconSizes = {
  xs: {
    width: "w-4 sm:w-6",
    height: "h-4 sm:h-6",
    widthPx: 16,
    heightPx: 16,
    widthRem: 1,
    heightRem: 1,
  },
  sm: {
    width: "w-6 sm:w-10",
    height: "h-6 sm:h-10",
    widthPx: 24,
    heightPx: 24,
    widthRem: 1.5,
    heightRem: 1.5,
  },
  md: {
    width: "w-8",
    height: "h-8",
    widthPx: 32,
    heightPx: 32,
    widthRem: 2,
    heightRem: 2,
  },
  lg: {
    width: "w-9",
    height: "h-9",
    widthPx: 36,
    heightPx: 36,
    widthRem: 2.25,
    heightRem: 2.25,
  },
  xl: {
    width: "w-12",
    height: "h-12",
    widthPx: 48,
    heightPx: 48,
    widthRem: 3,
    heightRem: 3,
  },
};

interface IconSizeProps {
  size: IconSize;
  specialIcon?: SpecialIconSize;
}

export const getIconSize = ({ size, specialIcon }: IconSizeProps) => {
  const iconSize = specialIcon
    ? specialIconSizes[specialIcon][size]
    : iconSizes[size];

  const width = iconSize?.width ?? "w-full";
  const height = iconSize?.height ?? "h-full";
  return {
    width,
    height,
    widthPx: iconSize?.widthPx ?? 32,
    heightPx: iconSize?.heightPx ?? 32,
    widthRem: iconSize?.widthRem ?? 2,
    heightRem: iconSize?.heightRem ?? 2,
    className: `${width} ${height}`,
  };
};
