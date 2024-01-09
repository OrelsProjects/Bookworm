import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React from "react";

export interface BookThumbnailProps {
  title?: string;
  src?: string;
  height?: number;
  width?: number;
  fill?: boolean;
  placeholder?: PlaceholderValue;
  blurDataURL?: string;
  className?: string;
}

const BookThumbnail: React.FC<BookThumbnailProps> = ({
  title,
  src,
  height,
  width,
  fill,
  placeholder,
  blurDataURL,
  className,
}) => {
  return (
    <Image
      src={src ?? "/thumbnailPlaceholder.png"}
      alt={`${title} thumbnail`}
      fill={fill}
      height={fill ? undefined : height ?? 64}
      width={fill ? undefined : width ?? 80}
      placeholder={placeholder ?? "blur"}
      blurDataURL={blurDataURL ?? "/thumbnailPlaceholder.png"}
      className={`${className}`}
    />
  );
};

export default BookThumbnail;
