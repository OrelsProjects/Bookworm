export type ThumbnailSize =
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

const thumbnailSizes = {
  ["2xs"]: { width: "w-thumbnail-2xs", height: "h-thumbnail-2xs" },
  ["xs"]: { width: "w-thumbnail-xs", height: "h-thumbnail-xs" },
  ["sm"]: { width: "w-thumbnail-sm", height: "h-thumbnail-sm" },
  ["md"]: { width: "w-thumbnail-md", height: "h-thumbnail-md" },
  ["lg"]: { width: "w-thumbnail-lg", height: "h-thumbnail-lg" },
  ["xl"]: {
    width: "w-thumbnail-xl",
    height: "h-thumbnail-xl",
  },
  ["2xl"]: {
    width: "w-thumbnail-lg 2xs:w-thumbnail-xl xs:w-thumbnail-2xl",
    height: "h-thumbnail-xl 2xs:h-thumbnail-2xl xs:h-thumbnail-3xl",
  },
  ["3xl"]: {
    width: "w-thumbnail-xl 2xs:w-thumbnail-2xl xs:w-thumbnail-3xl",
    height: "h-thumbnail-xl 2xs:h-thumbnail-2xl xs:h-thumbnail-3xl",
  },
};
export const getThumbnailSize = (thumbnailSize?: ThumbnailSize) => {
  const size = thumbnailSizes[thumbnailSize ?? "md"];
  const width = size?.width ?? "w-full";
  const height = size?.height ?? "h-full";
  return {
    width,
    height,
    className: `${width} ${height}`,
  };
};
