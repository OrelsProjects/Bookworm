import { useEffect, useRef } from "react";

export type ScrollDirection = "height" | "width";

interface AdditionalOptions {
  scrollDirection?: ScrollDirection;
  element?: HTMLElement;
  lowerThreshold?: number;
  upperThreshold?: number;
  onThreshold?: () => void;
  timeBetweenScrollCalls?: number;
}

function useScrollPosition(options?: AdditionalOptions) {
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  let pagingTimeout: NodeJS.Timeout | null = null;

  const handleScroll = () => {
    if (!scrollableDivRef.current) return;
    const scrollbar: HTMLDivElement = scrollableDivRef.current;
    const scrollPosition =
      options?.scrollDirection === "width"
        ? scrollbar.scrollLeft + scrollbar.clientWidth
        : scrollbar.scrollTop + scrollbar.clientHeight;
    const totalSize =
      options?.scrollDirection === "width"
        ? scrollbar.scrollWidth
        : scrollbar.scrollHeight;
    const scrollPercentage = (scrollPosition / totalSize) * 100;

    if (
      scrollPercentage >= (options?.lowerThreshold ?? 50) &&
      scrollPercentage <= (options?.upperThreshold ?? 65)
    ) {
      if (pagingTimeout) {
        clearTimeout(pagingTimeout);
      }
      pagingTimeout = setTimeout(() => {
        options?.onThreshold?.();
      }, options?.timeBetweenScrollCalls || 50);
    }
  };

  useEffect(() => {
    const scrollbar = scrollableDivRef.current;
    if (!scrollbar) return;

    scrollbar.addEventListener("scroll", handleScroll);
    return () => scrollbar.removeEventListener("scroll", handleScroll);
  }, [scrollableDivRef]);

  return { scrollableDivRef };
}

export default useScrollPosition;
