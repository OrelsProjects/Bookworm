"use client";

import React, { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

const Modal: React.FC<Props> = ({ children, isOpen, onClose, className }) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsRendered(isOpen);
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
        // let timeout: NodeJS.Timeout | null = null;
        onClose?.();
        setIsRendered(false);
        // timeout = setTimeout(() => {}, 1000);
        // return () => {
        //   if (timeout) {
        //     clearTimeout(timeout);
        //   }
        // };
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isOpen]);

  return (
    <div className="flex justify-center items-center relative w-full h-full">
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-1000 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {isRendered && (
        <div
          className={`relative z-50 w-modal h-modal flex items-center justify-center ${className}`}
        >
          <div ref={modalRef} className="rounded-lg shadow-lg font-sans">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
