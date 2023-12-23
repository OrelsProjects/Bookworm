"use client";

import React, { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const Modal: React.FC<Props> = ({ children, isOpen, onClose, className }) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timeoutId = setTimeout(() => setIsRendered(false), 1000); // Duration of the closing animation
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      {isRendered && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-1000 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {isRendered && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full transition-all duration-1000 ease-in-out ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-48"
          }
          ${className}
          `}
        >
          <div
            ref={modalRef}
            className="bg-background p-4 rounded-lg shadow-lg relative"
          >
            <div
              className="absolute top-0 right-0 p-2 text-foreground text-xl cursor-pointer"
              onClick={onClose}
            >
              X
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
