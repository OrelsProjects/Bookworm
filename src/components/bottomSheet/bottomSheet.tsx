"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { EventTracker } from "@/src/eventTracker";
import { IoArrowBack } from "react-icons/io5";

interface BottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  backgroundColor?: string;
  onClose?: () => void;
  outsideClickClose?: boolean;
  className?: string;
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

const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  isOpen,
  backgroundColor,
  onClose,
  outsideClickClose = false,
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

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        if (outsideClickClose) {
          onClose?.();
        } else {
          EventTracker.track("User clicked outside modal");
        }
      }
    };
    if (typeof window === "undefined") return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isOpen, outsideClickClose]);

  return (
    shouldRender && (
      <div className="flex justify-center items-center relative w-full h-full">
        <motion.div
          ref={modalRef}
          className={`relative z-50 w-full h-full flex items-center justify-center rounded-lg font-sans ${className}`}
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
            className="h-4/5 w-full bg-background absolute bottom-0 rounded-t-5xl flex justify-center items-center"
            variants={bottomSheetVariants}
            initial="closed"
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    )
  );
};

export default BottomSheet;
