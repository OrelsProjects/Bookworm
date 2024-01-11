import { AnimationProps, MotionProps, motion } from "framer-motion";
import React from "react";

export enum ExpandType {
  TopLeft,
  Center,
}

interface AnimationDivProps {
  children?: React.ReactNode;
  innerRef?: React.RefObject<HTMLDivElement>;
  className?: string;
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
  ...props
}: AnimationDivProps) => {
  return (
    <motion.div
      ref={innerRef}
      className={`w-full h-full ${className || ""}`}
      {...animationProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const opacityAnimationProps: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const bottomToMidAnimationProps: MotionProps = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 50, opacity: 0 },
  transition: { type: "spring", stiffness: 100 },
};

const expandingTopLeftAnimationProps: MotionProps = {
  initial: { scaleX: 0, scaleY: 0, originX: 1, originY: 0 },
  animate: { scaleX: 1, scaleY: 1, originX: 1, originY: 0 },
  exit: { scaleX: 0, scaleY: 0, originX: 1, originY: 1 },
  transition: { duration: 0.1, ease: "easeInOut" },
};

const expandingCenterAnimationProps: MotionProps = {
  initial: { scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5 },
  animate: { scaleX: 1.1, scaleY: 1.1, originX: 0.5, originY: 0.5 },
  exit: { scaleX: 1, scaleY: 1, originX: 0.5, originY: 0.5 },
  transition: { duration: 0.1, ease: "easeInOut" },
};

// Opacity Animation Wrapper
export const OpacityDiv = ({ innerRef, ...props }: AnimationDivProps) => (
  <GeneralDiv
    innerRef={innerRef}
    {...props}
    animationProps={opacityAnimationProps}
  />
);

// Bottom to Middle Animation Wrapper
export const BottomToMidDiv = ({ innerRef, ...props }: AnimationDivProps) => (
  <GeneralDiv
    innerRef={innerRef}
    {...props}
    animationProps={bottomToMidAnimationProps}
  />
);

const getExpandProps = (expandType?: ExpandType): MotionProps => {
  switch (expandType) {
    case ExpandType.TopLeft:
      return expandingTopLeftAnimationProps;
    case ExpandType.Center:
      return expandingCenterAnimationProps;
    default:
      return expandingTopLeftAnimationProps;
  }
};

// Expanding Animation Wrapper
export const ExpandingDiv = ({
  innerRef,
  expandType,
  ...props
}: ExpandDivProps) => (
  <GeneralDiv
    innerRef={innerRef}
    {...props}
    animationProps={getExpandProps()}
  />
);
