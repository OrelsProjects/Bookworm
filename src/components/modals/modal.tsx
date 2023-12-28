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
        let timeout: NodeJS.Timeout | null = null;
        onClose?.();
        timeout = setTimeout(() => {
          setIsRendered(false);
        }, 1000);
        return () => {
          if (timeout) {
            clearTimeout(timeout);
          }
        };
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isOpen]);

  return (
    <>
      {isOpen && (
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
            className="bg-secondary p-4 rounded-lg shadow-lg relative"
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
