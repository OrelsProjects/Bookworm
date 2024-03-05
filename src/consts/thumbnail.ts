export enum ThumbnailSize {
  ExtraSmall = "64x96",
  Small = "80x128",
  Medium = "96x144",
  Large = "128x176",
}

export const getThumbnailSize = (thumbnailSize?: ThumbnailSize) => {
  let width = "w-24";
  let height = "h-36";

  switch (thumbnailSize ?? ThumbnailSize.Medium) {
    case ThumbnailSize.ExtraSmall:
      width = "w-16";
      height = "h-24";
      break;
    case ThumbnailSize.Small:
      width = "w-20";
      height = "h-32";
      break;
    case ThumbnailSize.Medium:
      width = "w-24";
      height = "h-36";
      break;
    case ThumbnailSize.Large:
      width = "w-30";
      height = "h-44";
      break;
  }
  return {
    width,
    height,
    className: `${width} ${height}`,
  };
};
