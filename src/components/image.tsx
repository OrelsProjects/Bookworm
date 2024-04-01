import React, { useState } from "react";
import { ThumbnailSize, getThumbnailSize } from "../consts/thumbnail";
import { Skeleton } from "./ui/skeleton";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  thumbnailSize: ThumbnailSize;
}

const CustomImage: React.FC<ImageProps> = ({ thumbnailSize, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <Skeleton
          className={`${getThumbnailSize(thumbnailSize).className} rounded-xl`}
        />
      )}
      <img
        loading="lazy"
        onLoad={handleImageLoad}
        style={{ display: isLoading ? "none" : "block" }}
        {...props}
      />
    </>
  );
};

export default CustomImage;
