import React, { useState } from "react";
import { ThumbnailSize, getThumbnailSize } from "../consts/thumbnail";
import { Skeleton } from "./ui/skeleton";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  thumbnailSize: ThumbnailSize;
  placeholder?: React.ReactNode;
  defaultImage?: React.ReactNode;
  defaultUrl?: string;
}

const CustomImage: React.FC<ImageProps> = ({
  thumbnailSize,
  placeholder,
  defaultImage,
  defaultUrl,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setError(true);
  };

  if (error) {
    if (defaultImage) {
      return defaultImage;
    } else if (defaultUrl) {
      return <img src={defaultUrl} {...props} />;
    }
  }

  return (
    <>
      {isLoading &&
        (placeholder ? (
          placeholder
        ) : (
          <Skeleton
            className={`${
              getThumbnailSize(thumbnailSize).className
            } rounded-xl`}
          />
        ))}
      <img
        loading="eager"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: isLoading ? "none" : "block" }}
        {...props}
      />
    </>
  );
};

export default CustomImage;
