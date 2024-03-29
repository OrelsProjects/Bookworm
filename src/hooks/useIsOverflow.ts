import * as React from "react";

interface UseIsOverflowProps {
  ref: React.RefObject<HTMLElement>;
  isVerticalOverflow: boolean;
  callback?: (isOverflow: boolean) => void;
  delay?: number; // Optional delay in milliseconds
}

const useIsOverflow = ({
  ref,
  isVerticalOverflow,
  callback,
  delay = 0, // Default to no delay
}: UseIsOverflowProps): boolean | undefined => {
  const [isOverflow, setIsOverflow] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const checkOverflow = () => {
      if (ref.current) {
        const { clientWidth, scrollWidth, clientHeight, scrollHeight } = ref.current;
        console.log("scrollHeight", scrollHeight);
        console.log("clientHeight", clientHeight);
        const hasOverflow = isVerticalOverflow
          ? scrollHeight > clientHeight
          : scrollWidth > clientWidth;
        setIsOverflow(hasOverflow);
        if (callback) {
          callback(hasOverflow);
        }
      }
    };

    const timeoutId = setTimeout(checkOverflow, delay);

    // Cleanup timeout on component unmount or when any dependency changes
    return () => clearTimeout(timeoutId);
  }, [ref, isVerticalOverflow, callback, delay]);

  return isOverflow;
};

export default useIsOverflow;
