import React from "react";
import { cn } from "../../../lib/utils";

interface ModalContentContainer {
  children?: React.ReactNode;
  className?: string;
}

interface ModalContentProps {
  className?: string;
  children?: React.ReactNode;
  thumbnail?: React.ReactNode;
  buttonsRow?: React.ReactNode;
  bottomSection?: React.ReactNode;
  thumbnailDetails?: React.ReactNode;
}

const TopSectionContainer: React.FC<
  ModalContentContainer & { thumbnail: React.ReactNode }
> = ({ children, className, thumbnail }) => (
  <div
    className={`w-full flex flex-row justify-start gap-[5px] relative pt-1 ${
      className ?? ""
    }`}
  >
    <div className={`-mt-12 md:mt-0 h-fit flex-shrink-0 shadow-md rounded-xl`}>
      {thumbnail}
    </div>
    {children}
  </div>
);

const LeftSectionContainer: React.FC<
  ModalContentContainer & { thumbnail: React.ReactNode }
> = ({ children, className, thumbnail }) => (
  <div
    className={`h-full w-full flex flex-row items-center justify-start gap-[30px] ${
      className ?? ""
    }`}
  >
    <div className={`-ml-[170px] h-fit flex-shrink-0 shadow-md rounded-xl`}>
      {thumbnail}
    </div>
    {children}
    <div className="h-[100vh] w-[1px] flex justify-center items-center">
      <div className="h-[90%] w-[1px] bg-muted-foreground" />
    </div>
  </div>
);

const RightSectionContainer: React.FC<ModalContentContainer> = ({
  children,
  className,
}) => (
  <div
    className={`h-[90%] w-full hidden md:flex flex-col items-center justify-start gap-[30px] mr-10 overflow-auto ${
      className ?? ""
    }`}
  >
    {children}
  </div>
);

const ContentContainer: React.FC<ModalContentContainer> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      "h-fit md:h-full w-full flex flex-col md:flex-row justify-start md:justify-center items-center gap-[25px] px-8 md:px-0 bg-background rounded-tl-5xl rounded-tr-5xl md:rounded-tr-none md:rounded-l-2xl md:overscroll-none",
      "md:max-w-[1200px] mx-auto",
      className
    )}
  >
    {children}
  </div>
);

export const ModalContent: React.FC<ModalContentProps> = ({
  className,
  thumbnail,
  buttonsRow,
  bottomSection,
  thumbnailDetails,
}) => (
  <ContentContainer className={className}>
    <div className="w-full h-fit flex flex-col items-center md:w-fit md:flex-shrink-0 md:ml-[35px]">
      <TopSectionContainer thumbnail={thumbnail} className="md:hidden">
        <div className="h-full w-full flex flex-col justify-center items-start gap-1">
          {thumbnailDetails}
        </div>
      </TopSectionContainer>
      <LeftSectionContainer thumbnail={thumbnail} className="hidden md:flex">
        {buttonsRow}
      </LeftSectionContainer>
    </div>
    <div className="w-full h-full md:hidden">
      {buttonsRow}
      {bottomSection}
    </div>
    <RightSectionContainer>
      {thumbnailDetails}
      {bottomSection}
    </RightSectionContainer>
  </ContentContainer>
);
