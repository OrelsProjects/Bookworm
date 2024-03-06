import React from "react";

interface ModalContentContainer {
  children?: React.ReactNode;
  className?: string;
}

interface ModalContentProps {
  thumbnail?: React.ReactNode;
  thumbnailDetails?: React.ReactNode;
  buttonsRow?: React.ReactNode;
  bottomSection?: React.ReactNode;
}

const TopSectionContainer: React.FC<
  ModalContentContainer & { thumbnail: React.ReactNode }
> = ({ children, className, thumbnail }) => (
  <div
    className={`w-full flex flex-row justify-start gap-2 relative pt-4 ${className}`}
  >
    <div className={`-mt-12 h-fit flex-shrink-0`}>{thumbnail}</div>
    {children}
  </div>
);

const ContentContainer: React.FC<ModalContentContainer> = ({
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
const BottomSectionContainer: React.FC<ModalContentContainer> = ({
  children,
  className,
}) => (
  <div
    className={`flex gap-2 w-full h-full flex-col scrollbar-hide ${className}`}
  >
    {children}
  </div>
);

export const ModalContent: React.FC<ModalContentProps> = ({
  thumbnail,
  thumbnailDetails,
  buttonsRow,
  bottomSection,
}) => (
  <ContentContainer>
    <div className="h-fit w-full">
      <div className="w-full h-full flex flex-col items-center overflow-visible gap-4">
        <TopSectionContainer thumbnail={thumbnail}>
          <div className="h-full flex flex-col justify-center items-start gap-1">
            {thumbnailDetails}
          </div>
        </TopSectionContainer>
        {buttonsRow}
      </div>
    </div>
    <BottomSectionContainer>
      {bottomSection}
    </BottomSectionContainer>
  </ContentContainer>
);
