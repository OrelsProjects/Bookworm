"use client";

import { motion } from "framer-motion";
import React, {
  HTMLAttributes,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoArrowBack } from "react-icons/io5";
import { ExpandType, ExpandingDiv, OpacityDiv } from "../animationDivs";
import SizeContext from "../../lib/context/sizeContext";
import { EventTracker } from "../../eventTracker";
import { ModalTypes } from "../../lib/features/modal/modalSlice";
import ModalContext from "../../lib/context/modalContext";
import { cn } from "../../../lib/utils";

interface ContentDivProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  shouldAnimate?: boolean;

  className?: string;
  backgroundColor?: string;
  contentClassName?: string;

  type: ModalTypes;

  children?: React.ReactNode;
  topBarCollapsed: React.ReactNode;

  onClose?: () => void;
}

const TopBarCollapsed = ({
  children,
  scrollRef,
  onClose,
}: {
  onClose?: () => void;
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
      className="w-full h-fit bg-background fixed top-0 left-0 z-30 flex justify-start items-center flex-shrink-0 md:hidden"
      style={{ opacity: currentScrollPosition }}
    >
      <BackButton onClick={onClose} className="!top-2 !left-2 fixed" />
      {children}
    </div>
  );
};

export const BackButton = ({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) => (
  <div
    className={cn(
      "absolute top-[25px] md:top-[66px] left-[31px] flex flex-row justify-center items-center gap-2.5 cursor-pointer md:hover:bg-slate-500/40 md:rounded-full md:p-2",
      className
    )}
    onClick={onClick}
  >
    <motion.div
      className={`h-10 w-10 z-30`}
      // whileHover={{ scale: 1.2 }}
    >
      <div className="bg-background h-10 w-10 rounded-full shadow-md flex justify-center items-center md:border md:border-foreground">
        <IoArrowBack className="!text-foreground !w-6 !h-6" />
      </div>
    </motion.div>
    <span className="hidden md:flex text-2xl font-light">Back</span>
  </div>
);

const Modal: React.FC<ModalProps> = ({
  type,
  isOpen,
  onClose,
  children,
  className,
  topBarCollapsed,
  contentClassName,
  shouldAnimate = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  const modalContext = useContext(ModalContext);
  const { width, height } = useContext(SizeContext);

  useEffect(() => {
    const handleBackButtonClick = () => {
      onClose?.();
    };
    window.addEventListener("popstate", handleBackButtonClick);

    return () => window.removeEventListener("popstate", handleBackButtonClick);
  }, []);

  const backgroundColor = useMemo(
    () => modalContext[type],
    [type, modalContext, modalContext[type]]
  );

  const ContentDiv: React.FC<ContentDivProps> = ({}) =>
    useMemo(() => {
      const key = "modal";
      const className =
        "h-4/5 w-full md:h-full md:w-[85%] bg-background rounded-tr-5xl rounded-tl-5xl md:rounded-tr-none md:rounded-l-2xl";
      const onClick = (e: any) => e.stopPropagation();

      return shouldAnimate ? (
        <>
          <ExpandingDiv
            key={key}
            className={`${className} md:hidden`}
            onClick={onClick}
            isOpen={isOpen}
            expandType={ExpandType.Modal}
          >
            {children}
          </ExpandingDiv>
          <ExpandingDiv
            key={key}
            className={`${className} hidden md:flex relative`}
            onClick={onClick}
            isOpen={isOpen}
            expandType={ExpandType.RightToLeft}
          >
            <BackButton onClick={onClose} />
            {children}
          </ExpandingDiv>
        </>
      ) : (
        <div key={key} className={className} onClick={onClick}>
          {children}
        </div>
      );
    }, [isOpen, children]);

  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 bottom-0 w-full h-full md:!h-[100vh] z-30 overscroll-none overflow-auto bg-background md:bg-transparent md:pl-[262px]",
        className
      )}
      style={{ height, width }}
      ref={scrollableDivRef}
      id="modal"
    >
      {topBarCollapsed && (
        <TopBarCollapsed scrollRef={scrollableDivRef} onClose={onClose}>
          {topBarCollapsed}
        </TopBarCollapsed>
      )}
      <OpacityDiv
        innerRef={modalRef}
        opacityKey="modal-background"
        isOpen={isOpen}
        shouldAnimate={shouldAnimate}
      >
        <div
          className="w-full h-full overscroll-none bg-background relative"
          ref={scrollableDivRef}
        >
          <BackButton onClick={onClose} className="md:hidden" />
          <div className="flex justify-center items-center relative w-full h-full z-20">
            <div
              className={`relative z-40 w-full flex items-end  justify-start md:justify-end self-start h-full ${
                contentClassName ?? ""
              } z-10`}
              onClick={onClose}
            >
              <div
                className="-z-10 absolute inset-0 w-full h-full bg-background"
                style={{
                  backgroundColor: backgroundColor ?? "rgb(12, 12, 12)",
                }}
              />
              <ContentDiv
                key="modal"
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
