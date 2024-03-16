export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export enum SpecialIconSize {
  Bookmark = "bookmark",
}

const specialIconSizes = {
  [SpecialIconSize.Bookmark]: {
    "xs": {
      width: "w-3",
      height: "h-4",
      widthPx: 12,
      heightPx: 16,
    },
    "sm": {
      width: "w-5",
      height: "h-6",
      widthPx: 20,
      heightPx: 24,
    },
    "md": {
      width: "w-7",
      height: "h-8",
      widthPx: 28,
      heightPx: 32,
    },
    "lg": {
      width: "w-8",
      height: "h-9",
      widthPx: 32,
      heightPx: 36,
    },
    "xl": {
      width: "w-11",
      height: "h-12",
      widthPx: 44,
      heightPx: 48,
    },
  },
};

const iconSizes = {
  "xs": { width: "w-4", height: "h-4", widthPx: 16, heightPx: 16 },
  "sm": {
    width: "w-6",
    height: "h-6",
    widthPx: 24,
    heightPx: 24,
  },
  "md": {
    width: "w-8",
    height: "h-8",
    widthPx: 32,
    heightPx: 32,
  },
  "lg": {
    width: "w-9",
    height: "h-9",
    widthPx: 36,
    heightPx: 36,
  },
  "xl": {
    width: "w-12",
    height: "h-12",
    widthPx: 48,
    heightPx: 48,
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
    className: `!${width} !${height}`,
  };
};
