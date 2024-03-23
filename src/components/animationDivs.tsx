import {
  AnimatePresence,
  LayoutProps,
  MotionProps,
  motion,
} from "framer-motion";
import React from "react";

export enum ExpandType {
  TopLeft,
  TopRight,
  Center,
  Modal,
  BottomToTop,
}

interface AnimationDivProps extends LayoutProps {
  key?: string | number;
  isOpen?: boolean;
  children?: React.ReactNode;
  innerRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  style?: React.CSSProperties;
  animationProps?: MotionProps;
}

interface ExpandDivProps extends AnimationDivProps {
  expandType?: ExpandType;
}

const GeneralDiv = ({
  children,
  className,
  animationProps,
  innerRef,
  isOpen = true,
  ...props
}: AnimationDivProps) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key={props.key ?? `${Math.random()}`}
          ref={innerRef}
          className={`w-full h-full ${className || ""}`}
          {...animationProps}
          // {...props}
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

// Opacity Animation Wrapper
const OpacityDiv = ({ innerRef, ...props }: AnimationDivProps) =>
  props.children;
// (
//   <GeneralDiv
//     innerRef={innerRef}
//     {...props}
//     animationProps={opacityAnimationProps}
//   />
// );

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
