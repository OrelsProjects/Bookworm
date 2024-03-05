import React from "react";
import { ThumbnailSize, getThumbnailSize } from "../../consts/thumbnail";

interface ModalContentContainer {
  children?: React.ReactNode;
  className?: string;
}

export const TopSectionContainer: React.FC<
  ModalContentContainer & { thumbnail: React.ReactNode }
> = ({ children, className, thumbnail }) => (
  <div
    className={`w-full flex flex-row justify-start gap-2 relative pt-4 ${className}`}
  >
    <div className={`-mt-12 flex-shrink-0`}>{thumbnail}</div>
    {children}
  </div>
);

export const ContentContainer: React.FC<ModalContentContainer> = ({
  children,
  className,
}) => (
  <div
    className={`h-full w-full flex flex-col justify-start items-center gap-10 px-8 pb-4 ${className}`}
  >
    <div className="h-fit w-full">
      <div className="w-full h-full flex flex-col items-center overflow-visible gap-4">
        {children}
      </div>
    </div>
  </div>
);
