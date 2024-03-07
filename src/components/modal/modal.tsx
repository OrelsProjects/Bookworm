"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
export interface ModalProps {
  isOpen: boolean;
  backgroundColor?: string;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
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

const Modal: React.FC<ModalProps> = ({
  isOpen,
  backgroundColor,
  onClose,
  className,
  children,
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

  return (
    shouldRender && (
      <div className="absolute top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-x-clip z-50">
        <div className="flex justify-center items-center relative w-full h-full">
          <motion.div
            ref={modalRef}
            className={`relative z-50 w-full h-full flex items-end justify-start rounded-lg ${className ?? ""} z-10`}
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
              {children}
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  );
};

export default Modal;
