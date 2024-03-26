"use client";

import { motion } from "framer-motion";
import React, {
  HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoArrowBack } from "react-icons/io5";
import { ExpandType, ExpandingDiv, OpacityDiv } from "../animationDivs";

interface ContentDivProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  backgroundColor?: string;
  topBarCollapsed: React.ReactNode;
  onClose?: () => void;
  className?: string;
  shouldAnimate?: boolean;
  children?: React.ReactNode;
}

const BackButton = ({ onClick }: { onClick?: () => void }) => (
  <motion.div
    className="h-6 w-6 fixed top-2 left-2 z-30"
    whileHover={{ scale: 1.2 }}
  >
    <div
      className="bg-background h-10 w-10 rounded-full shadow-sm shadow-background flex justify-center items-center"
      onClick={onClick}
    >
      <IoArrowBack className="!text-foreground !w-6 !h-6" />
    </div>
  </motion.div>
);

const TopBarCollapsed = ({
  children,
  scrollRef,
}: {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
}) => {
  const [currentScrollPosition, setScrollPosition] = useState<number>(0);

  const handleScroll = () => {
    const scrollTop = scrollRef?.current?.scrollTop ?? 0;
    if (scrollTop > 120) {
      const scrolled = (scrollRef?.current?.scrollTop ?? 0) / 240;
      setScrollPosition(scrolled);
    } else {
      setScrollPosition(0);
    }
  };

  useEffect(() => {
    const scrollbar = scrollRef?.current;
    if (!scrollbar) return;
    scrollbar.addEventListener("scroll", handleScroll);
    return () => scrollbar.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  return (
    <div
      className="w-full h-fit bg-background fixed top-0 left-0 z-30 flex justify-start items-center flex-shrink-0"
      style={{ opacity: currentScrollPosition }}
    >
      {children}
    </div>
  );
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  backgroundColor,
  topBarCollapsed,
  onClose,
  className,
  children,
  shouldAnimate = true,
}) => {
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBackButtonClick = () => {
      onClose?.();
    };
    window.addEventListener("popstate", handleBackButtonClick);

    return () => window.removeEventListener("popstate", handleBackButtonClick);
  }, []);

  // const BackgroundDiv = ({
  //   isOpen,
  //   innerRef,
  //   children,
  //   ...props
  // }: {
  //   isOpen: boolean;
  //   innerRef?: React.RefObject<HTMLDivElement>;
  //   children: React.ReactNode;
  //   className?: string;
  //   props?: any;
  // }) =>
  //   useMemo(
  //     () =>
  //       shouldAnimate ? (
  //         <OpacityDiv isOpen={isOpen} innerRef={innerRef} {...props}>
  //           {children}
  //         </OpacityDiv>
  //       ) : (
  //         <div {...props}>{children}</div>
  //       ),
  //     [isOpen, innerRef, children, props]
  //   );

  const ContentDiv: React.FC<ContentDivProps> = ({}) =>
    useMemo(() => {
      const key = "modal";
      const className = "h-4/5 max-h-fit w-full bg-background rounded-t-5xl";
      const onClick = (e: any) => e.stopPropagation();

      return shouldAnimate ? (
        <ExpandingDiv
          key={key}
          className={className}
          onClick={onClick}
          isOpen={isOpen}
          expandType={ExpandType.Modal}
        >
          {children}
        </ExpandingDiv>
      ) : (
        <div key={key} className={className} onClick={onClick}>
          {children}
        </div>
      );
    }, [isOpen, children]);

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 w-screen h-screen max-h-fit z-50 overscroll-none overflow-auto bg-background"
      ref={scrollableDivRef}
    >
      <OpacityDiv innerRef={modalRef} key="modal-background" isOpen={isOpen}>
        <div
          className="w-full h-full overscroll-none bg-background relative"
          ref={scrollableDivRef}
        >
          <TopBarCollapsed scrollRef={scrollableDivRef}>
            {topBarCollapsed}
          </TopBarCollapsed>
          <BackButton onClick={onClose} />
          <div className="flex justify-center items-center relative w-full h-full z-20">
            <div
              className={`relative z-50 w-full h-full flex items-end justify-start ${
                className ?? ""
              } z-10`}
              style={{ backgroundColor: backgroundColor ?? "rgb(12, 12, 12)" }}
              onClick={onClose}
            >
              <ContentDiv
                key="modal"
                className="h-4/5 max-h-fit w-full bg-background rounded-t-5xl"
                isOpen={isOpen}
                onClick={(e) => e.stopPropagation()}
              >
                {children}
              </ContentDiv>
            </div>
          </div>
        </div>
      </OpacityDiv>
    </div>
  );
};

export default Modal;
