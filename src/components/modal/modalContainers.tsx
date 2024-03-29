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
  children?: React.ReactNode;
}

const TopSectionContainer: React.FC<
  ModalContentContainer & { thumbnail: React.ReactNode }
> = ({ children, className, thumbnail }) => (
  <div
    className={`w-full flex flex-row justify-start gap-[5px] relative pt-1 ${
      className ?? ""
    }`}
  >
    <div
      className={`-mt-12 h-fit flex-shrink-0 shadow-background shadow-md rounded-xl`}
    >
      {thumbnail}
    </div>
    {children}
  </div>
);

const ContentContainer: React.FC<ModalContentContainer> = ({
  children,
  className,
}) => (
  <div
    className={`h-full w-full flex flex-col justify-start items-center gap-4 px-8 pb-4 ${
      className ?? ""
    }`}
  >
    {children}
  </div>
);

export const ModalContent: React.FC<ModalContentProps> = ({
  thumbnail,
  thumbnailDetails,
  buttonsRow,
  bottomSection,
  children,
}) => (
  <ContentContainer>
    <div className="w-full h-fit flex flex-col items-center gap-4">
      <TopSectionContainer thumbnail={thumbnail}>
        <div className="h-full w-full flex flex-col justify-center items-start gap-1">
          {thumbnailDetails}
        </div>
      </TopSectionContainer>
    </div>
    {buttonsRow}
    {bottomSection}
  </ContentContainer>
);
