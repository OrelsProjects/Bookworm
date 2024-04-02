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
  ["lg"]: {
    width: "w-thumbnail-lg md:w-thumbnail-2xl",
    height: "h-thumbnail-lg md:h-thumbnail-2xl",
  },
  ["xl"]: {
    width: "w-thumbnail-xl md:w-thumbnail-3xl",
    height: "h-thumbnail-xl md:h-thumbnail-3xl",
  },
  ["2xl"]: {
    width: "w-thumbnail-xl 2xs:w-thumbnail-xl xs:w-thumbnail-2xl md:w-thumbnail-3xl",
    height: "h-thumbnail-xl 2xs:h-thumbnail-xl xs:h-thumbnail-2xl md:h-thumbnail-3xl",
  },
  ["3xl"]: {
    width: "w-thumbnail-xl 2xs:w-thumbnail-2xl xs:w-thumbnail-3xl md:w-[225px]",
    height:
      "h-thumbnail-xl 2xs:h-thumbnail-2xl xs:h-thumbnail-3xl md:h-[320px]",
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
