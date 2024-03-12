export type ThumbnailSize = "xs" | "sm" | "md" | "lg" | "xl";

const thumbnailSizes = {
  ["xs"]: { width: "w-10 sm:w-16", height: "h-12 sm:h-20" },
  ["sm"]: { width: "w-12 sm:w-20", height: "h-16 sm:h-28" },
  ["md"]: { width: "w-14 sm:w-24", height: "h-20 sm:h-36" },
  ["lg"]: { width: "w-16 sm:w-30", height: "h-24 sm:h-44" },
  ["xl"]: { width: "w-22 sm:w-36", height: "h-32 sm:h-52" },
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
