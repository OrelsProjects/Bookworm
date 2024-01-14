"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { EventTracker } from "@/src/eventTracker";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  outsideClickClose?: boolean;
  className?: string;
}

const modalAnimationVariants = {
  open: { y: 0, opacity: 1 },
  closed: { y: 100, opacity: 0 },
};
const modalBackgroundAnimationVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

const Modal: React.FC<Props> = ({
  children,
  isOpen,
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
          className={`fixed inset-0 bg-black bg-opacity-50 z-40`}
          variants={modalBackgroundAnimationVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          ref={modalRef}
          className={`relative z-50 modal-size flex items-center justify-center rounded-lg font-sans ${className}`}
          variants={modalAnimationVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full h-full rounded-lg font-sans relative">
            {children}
            <motion.div
              className="h-6 w-6 absolute top-2 right-2"
              whileHover={{ scale: 1.2 }}
            >
              <Image
                src="/x.svg"
                alt="close"
                layout="fill"
                className="cursor-pointer transition-all hover:bg-primary rounded-full"
                onClick={onClose}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  );
};

export default Modal;
