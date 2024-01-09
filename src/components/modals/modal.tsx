"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  outsideClickClose?: boolean;
  className?: string;
}

const Modal: React.FC<Props> = ({
  children,
  isOpen,
  onClose,
  outsideClickClose = false,
  className,
}) => {
  const [animateOpen, setAnimateOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timeout = setTimeout(() => {
        setAnimateOpen(true);
      }, 10);
      return () => clearTimeout(timeout);
    } else {
      setAnimateOpen(false);
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
          console.log("outside click. Use for event tracking");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isOpen, outsideClickClose]);

  return (
    shouldRender && (
      <div className="flex justify-center items-center relative w-full h-full">
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${
            animateOpen ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300 ease-in-out`}
        />

        <div
          ref={modalRef}
          className={`relative z-50 w-modal h-modal flex items-center justify-center rounded-lg shadow-lg font-sans ${className} transition-all duration-500 ease-in-out ${
            animateOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <div className="rounded-lg shadow-lg font-sans relative">
            {children}
            <Image
              src="/x.svg"
              alt="close"
              width={24}
              height={24}
              className="absolute top-2 right-2 cursor-pointer transition-all hover:bg-primary rounded-full"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
