export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export enum SpecialIconSize {
  Bookmark = "bookmark",
}

const specialIconSizes: Record<
  SpecialIconSize,
  Record<IconSize, { width: string; height: string }>
> = {
  [SpecialIconSize.Bookmark]: {
    ["xs"]: { width: "w-3", height: "h-4" },
    ["sm"]: { width: "w-5", height: "h-6" },
    ["md"]: { width: "w-7", height: "h-8" },
    ["lg"]: { width: "w-8", height: "h-9" },
    ["xl"]: { width: "w-11", height: "h-12" },
  },
};

const iconSizes = {
  ["xs"]: { width: "w-4", height: "h-4" },
  ["sm"]: { width: "w-6", height: "h-6" },
  ["md"]: { width: "w-8", height: "h-8" },
  ["lg"]: { width: "w-9", height: "h-9" },
  ["xl"]: { width: "w-12", height: "h-12" },
};

export interface IconSizeProps {
  iconSize: IconSize;
  specialIcon?: SpecialIconSize;
}

export const getIconSize = ({ iconSize, specialIcon }: IconSizeProps) => {
  const size = specialIcon
    ? specialIconSizes[specialIcon][iconSize]
    : iconSizes[iconSize];

  const width = size?.width ?? "w-full";
  const height = size?.height ?? "h-full";
  return {
    width,
    height,
    className: `${width} ${height}`,
  };
};
