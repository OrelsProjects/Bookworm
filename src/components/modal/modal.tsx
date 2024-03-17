"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { IoArrowBack } from "react-icons/io5";
import { ExpandType, ExpandingDiv, OpacityDiv } from "../animationDivs";

export interface ModalProps {
  isOpen: boolean;
  backgroundColor?: string;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  backgroundColor,
  onClose,
  className,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBackButtonClick = () => {
      onClose?.();
    };
    window.addEventListener("popstate", handleBackButtonClick);

    return () => window.removeEventListener("popstate", handleBackButtonClick);
  }, []);

  return (
    <OpacityDiv
      className="absolute top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-y-auto overflow-x-clip z-50 overscroll-none"
      innerRef={modalRef}
      key="modal-background"
      isOpen={isOpen}
    >
      <div className="flex justify-center items-center relative w-full h-full">
        <div
          className={`relative z-50 w-full h-full flex items-end justify-start rounded-lg ${
            className ?? ""
          } z-10`}
          style={{ backgroundColor: backgroundColor ?? "rgb(12, 12, 12)" }}
        >
          <motion.div
            className="h-6 w-6 absolute top-8 left-8"
            whileHover={{ scale: 1.2 }}
          >
            <div
              className="bg-background h-10 w-10 rounded-full shadow-sm shadow-background flex justify-center items-center"
              onClick={onClose}
            >
              <IoArrowBack className="!text-foreground !w-6 !h-6" />
            </div>
          </motion.div>
          <ExpandingDiv
            key="modal"
            className="h-4/5 w-full bg-background rounded-t-5xl overscroll-none"
            expandType={ExpandType.Modal}
            isOpen={isOpen}
          >
            {children}
          </ExpandingDiv>
        </div>
      </div>
    </OpacityDiv>
  );
};

export default Modal;
