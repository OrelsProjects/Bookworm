export type ThumbnailSize = "3xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const thumbnailSizes = {
  ["3xs"]: { width: "w-9", height: "h-11" },
  ["xs"]: { width: "w-16", height: "h-24" },
  ["sm"]: { width: "w-20", height: "h-32" },
  ["md"]: { width: "w-24", height: "h-36" },
  ["lg"]: { width: "w-30", height: "h-44" },
  ["xl"]: { width: "w-30 xs:w-36", height: "h-44 xs:h-52" },
  ["2xl"]: { width: "w-44", height: "h-64" },
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
