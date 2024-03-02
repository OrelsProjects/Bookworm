"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import BookThumbnail from "../book/bookThumbnail";
import { Skeleton } from "../skeleton";

export interface ModalProps {
  isOpen: boolean;
  backgroundColor?: string;
  onClose?: () => void;
  className?: string;
}

interface ModalContentProps {
  thumbnail?: React.ReactNode;
  thumbnailDetails?: React.ReactNode;
  buttonsRow?: React.ReactNode;
  bottomSection?: React.ReactNode;
}

const modalAnimationVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};
const modalBackgroundAnimationVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

const bottomSheetVariants = {
  open: { y: 0 },
  closed: { y: 1 },
};

const Modal: React.FC<ModalProps & ModalContentProps> = ({
  thumbnail,
  thumbnailDetails,
  buttonsRow,
  bottomSection,
  isOpen,
  backgroundColor,
  onClose,
  className,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Duration of the closing animation
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const ContentContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="h-full w-full flex flex-col justify-start items-center">
      {children}
    </div>
  );

  const TopSectionContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full flex flex-row justify-center gap-2 relative pt-4">
      {children}
    </div>
  );

  const DetailsSkeleton = () => (
    <div className="h-full flex flex-col justify-between">
      <Skeleton className="rounded-full w-40 h-6" type="none" />
      <Skeleton className="rounded-full w-40 h-6" type="none" />
      <Skeleton className="rounded-full w-40 h-6" type="none" />
    </div>
  );

  const ButtonsSkeleton = () => (
    <div className="h-24 w-full flex flex-row justify-evenly items-center gap-4">
      <Skeleton className="rounded-full w-8 h-8" type="none" />
      <Skeleton className="rounded-full w-8 h-8" type="none" />
      <Skeleton className="rounded-full w-8 h-8" type="none" />
    </div>
  );

  const BottomSkeleton = () => (
    <div className="p-4 w-full h-full">
      <Skeleton className="rounded-lg p-4 w-full h-full" type="none" />
    </div>
  );

  return (
    shouldRender && (
      <div className="absolute top-0 left-0 right-0 bottom-0 w-screen h-screen">
        <div className="flex justify-center items-center relative w-full h-full">
          <motion.div
            ref={modalRef}
            className={`relative z-50 w-full h-full flex items-end justify-start rounded-lg ${className} z-10`}
            style={{ backgroundColor: backgroundColor ?? "rgb(12, 12, 12)" }}
            variants={modalAnimationVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="h-6 w-6 absolute top-8 left-8"
              whileHover={{ scale: 1.2 }}
            >
              <div
                className="bg-background h-10 w-10 rounded-full flex justify-center items-center shadow-2xl"
                onClick={onClose}
              >
                <IoArrowBack className="!text-foreground !w-6 !h-6" />
              </div>
            </motion.div>
            <motion.div
              className="h-4/5 w-full bg-background rounded-t-5xl"
              variants={bottomSheetVariants}
              initial="closed"
              transition={{ duration: 0.3 }}
            >
              <ContentContainer>
                <div className="h-fit w-full">
                  <div className="w-full h-full flex flex-col items-center overflow-visible gap-4">
                    <TopSectionContainer>
                      <div className="w-32 h-fit">
                        <div className="w-full h-44 -mt-12">
                          {thumbnail ?? <BookThumbnail />}
                        </div>
                      </div>
                      <div className="h-full flex flex-col justify-center items-start gap-1 w-min">
                        {thumbnailDetails ?? <DetailsSkeleton />}
                      </div>
                    </TopSectionContainer>
                    {buttonsRow ?? <ButtonsSkeleton />}
                  </div>
                </div>
                {bottomSection ?? <BottomSkeleton />}
              </ContentContainer>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  );
};

export default Modal;
