import {
  AnimatePresence,
  LayoutProps,
  MotionProps,
  motion,
} from "framer-motion";
import React from "react";
import { cn } from "../lib/utils";

export enum ExpandType {
  TopLeft,
  TopRight,
  Center,
  Modal,
  RightToLeft,
  BottomToTop,
}

interface AnimationDivProps extends LayoutProps {
  opacityKey?: string | number;
  isOpen?: boolean;
  children?: React.ReactNode;
  shouldAnimate?: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  style?: React.CSSProperties;
  animationProps?: MotionProps;
}

interface ExpandDivProps extends AnimationDivProps {
  expandType?: ExpandType;
  onClick?: (e: any) => void;
}

const GeneralDiv = ({
  opacityKey,
  innerRef,
  children,
  className,
  isOpen = true,
  animationProps,
}: AnimationDivProps) => {
  console.log("opacityKey, isOpen", opacityKey, isOpen);
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key={opacityKey || `${Math.random()}`}
          ref={innerRef}
          className={cn("w-full h-full", className)}
          {...animationProps}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const opacityAnimationProps: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

const expandingTopLeftAnimationProps: MotionProps = {
  initial: { scaleX: 0, scaleY: 0, originX: 1, originY: 0 },
  animate: { scaleX: 1, scaleY: 1, originX: 1, originY: 0 },
  exit: { scaleX: 0, scaleY: 0, originX: 1, originY: 1 },
  transition: { duration: 0.1, ease: "easeInOut" },
};

const expandingTopRightAnimationProps: MotionProps = {
  initial: { scaleX: 0, scaleY: 0, originX: 0, originY: 0 },
  animate: { scaleX: 1, scaleY: 1, originX: 0, originY: 0 },
  exit: { scaleX: 0, scaleY: 0, originX: 0, originY: 1 },
  transition: { duration: 0.1, ease: "easeInOut" },
};

const expandingCenterAnimationProps: MotionProps = {
  initial: { scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5 },
  animate: { scaleX: 1.1, scaleY: 1.1, originX: 0.5, originY: 0.5 },
  exit: { scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5 },
  transition: { duration: 0.1, ease: "easeInOut" },
};

const expandingModal: MotionProps = {
  initial: { height: 0 },
  animate: { height: "80%" },
  exit: { height: 0 },
  transition: {
    duration: 0.25,
    ease: "easeInOut",
    type: "tween",
    stiffness: 70,
  },
};

const expandingBottomToTop: MotionProps = {
  initial: { height: 0 },
  animate: { height: "100%" },
  exit: { height: 0 },
  transition: {
    duration: 0.25,
    ease: "easeInOut",
    type: "tween",
    stiffness: 70,
  },
};

const expandingRightToLeft: MotionProps = {
  initial: { width: 0, height: "100%" },
  animate: { width: "85%", height: "100%" },
  exit: { width: 0 },
  transition: {
    duration: 0.25,
    ease: "easeInOut",
    type: "tween",
    stiffness: 70,
  },
};

// Opacity Animation Wrapper
const OpacityDiv = ({
  opacityKey,
  innerRef,
  shouldAnimate = true,
  ...props
}: AnimationDivProps) => {
  return shouldAnimate ? (
    <GeneralDiv
      opacityKey={opacityKey}
      innerRef={innerRef}
      animationProps={opacityAnimationProps}
      {...props}
    />
  ) : (
    props.children
  );
};

const getExpandProps = (expandType?: ExpandType): MotionProps => {
  switch (expandType) {
    case ExpandType.TopLeft:
      return expandingTopLeftAnimationProps;
    case ExpandType.Center:
      return expandingCenterAnimationProps;
    case ExpandType.Modal:
      return expandingModal;
    case ExpandType.TopRight:
      return expandingTopRightAnimationProps;
    case ExpandType.RightToLeft:
      return expandingRightToLeft;
    case ExpandType.BottomToTop:
      return expandingBottomToTop;
    default:
      return expandingTopLeftAnimationProps;
  }
};

// Expanding Animation Wrapper
const ExpandingDiv = ({ innerRef, expandType, ...props }: ExpandDivProps) => (
  <motion.div ref={innerRef} {...props} {...getExpandProps(expandType)} />
);

export { ExpandingDiv, OpacityDiv };
