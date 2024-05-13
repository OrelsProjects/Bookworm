import React, { useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export interface BookPageFlipItemProps {
  content: React.ReactNode;
}

export interface CoverProps {
  content: React.ReactNode;
}

interface BookPageFlipProps {
  items: BookPageFlipItemProps[];
  className?: string;
  onOpenBook?: () => void;
  onCloseBook?: () => void;
  onPageChange?: (page: BookPageFlipItemProps) => void;
}

const coverSizeClass =
  "w-[320px] h-[480px] md:h-[620px] md:max-h-[620px] lg:h-[720px] lg:max-h-[720px] md:w-[320px] lg:w-[480px] md:max-w-[320px] lg:max-w-[480px]";
const pageSizeClass =
  "w-full h-full md:h-[605px] md:max-h-[605px] lg:h-[705px] lg:max-h-[705px] md:w-[305px] lg:w-[465px] md:max-w-[305px] lg:max-w-[465px]";

const Cover = ({
  isFlipped,
  className,
  onClick,
  backCover,
}: {
  isFlipped?: boolean;
  className?: string;
  onClick?: () => void;
  backCover?: boolean;
}) => {
  const [showBack, setShowBack] = React.useState(false);

  useEffect(() => {
    if (isFlipped) {
      setTimeout(() => {
        setShowBack(true);
      }, 500);
    } else {
      setShowBack(false);
    }
  }, [isFlipped]);

  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full rounded-lg flex flex-col justify-center items-center relative bg-landing-cover shadow-xl overflow-clip",
        coverSizeClass,
        { isFlipped: "bg-landing-cover-brighter" },
        className
      )}
      style={{
        transition: "all 1s ease", // Adjust timing and easing here
        transformOrigin: "left center", // Set transform origin to left center
        transform:
          isFlipped && !backCover ? "rotateY(180deg)" : "rotateY(0deg)", // Rotate based on flipped state
        height: isFlipped ? "100vh" : "100%",
      }}
    >
      <div
        className={`${
          showBack ? "opacity-10" : "opacity-100"
        } flex justify-start items-center flex-col pt-4`}
      >
        <h1 className="text-background text-6.5xl">BookWiz</h1>
        <h3 className="text-foreground text-2xl">Reading With Purpose</h3>
        {!backCover && (
          <Image
            src="/landing-cover.png"
            alt="landing-cover"
            fill
            className="!relative !w-full !h-full object-cover rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

const Page = ({
  style,
  onClick,
  content,
  className,
  isFlipped,
}: {
  className?: string;
  isFlipped?: boolean;
  onClick?: () => void;
  content: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const styles = {
    ...style,
    transition: "all 2.7s ease", // Adjust timing and easing here
    transformOrigin: "left center", // Set transform origin to left center
    transform: isFlipped ? "rotateY(180deg) translateX(10px)" : "rotateY(0deg)",
  };
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full h-full rounded-lg flex flex-col justify-start items-center relative shadow-xl bg-landing-page",
        pageSizeClass,
        className
      )}
      style={{ ...styles }}
    >
      {content}
    </div>
  );
};

const BookPageFlip: React.FC<BookPageFlipProps> = ({
  items,
  className,
  onOpenBook,
  onCloseBook,
  onPageChange,
}) => {
  const [isBookOpen, setIsBookOpen] = React.useState(false);
  const [visiblePageIndex, setVisiblePageIndex] = React.useState<number>(-1);

  const handleCoverClick = () => {
    if (isBookOpen) {
      handleCloseBook();
    } else {
      handleOpenBook();
    }
  };

  const handleOpenBook = () => {
    setIsBookOpen(true);
    setVisiblePageIndex(0);
    onOpenBook?.();
  };

  const handleCloseBook = () => {
    setIsBookOpen(false);
    setVisiblePageIndex(-1);
    onCloseBook?.();
  };

  const handleNextPage = () => {
    if (visiblePageIndex < items.length) {
      setVisiblePageIndex(visiblePageIndex + 1);
      onPageChange?.(items[visiblePageIndex + 1]);
    }
  };

  const handlePrevPage = () => {
    if (visiblePageIndex !== null && visiblePageIndex > 0) {
      setVisiblePageIndex(visiblePageIndex - 1);
      onPageChange?.(items[visiblePageIndex - 1]);
    }
  };
  // If the index is less than the visiblePageIndex, the Z-index should be 50+length-index. Otherwise, it should be 50+length+index.
  const calculateZIndex = useCallback(
    (index: number) => {
      if (index < visiblePageIndex) {
        return 50 + items.length + index;
      } else {
        return 50 + items.length - index;
      }
    },
    [visiblePageIndex]
  );

  return (
    <div
      className={cn(
        "w-full h-full flex justify-start items-center flex-col gap-12 font-risque transition-all"
      )}
    >
      <div
        className={cn(
          coverSizeClass,
          "ml-[43px] mr-[57px] relative flex flex-col"
        )}
      >
        <motion.div
          className="w-full h-full absolute top-0 mt-[25%] md:!mt-[25%]"
          initial={{ marginTop: "25%" }}
          animate={isBookOpen ? { marginTop: "0" } : { marginTop: "25%" }}
        >
          <Cover
            onClick={handleCoverClick}
            isFlipped={isBookOpen}
            className={cn(
              `transition-transform duration-1000 translate-z-10 absolute inset-0 ${
                visiblePageIndex === -1 ? "z-50" : "z-30"
              }`
            )}
          />
          {isBookOpen ? (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ width: "86vw", height: "98vh", left: 6, top: 7 }}
              transition={{ duration: 0.8 }}
              exit={{ scale: 1 }}
              className={cn(
                "absolute z-40 left-2 rounded-lg top-2 flex flex-start justify-between items-center gap-6 !bg-transparent",
                pageSizeClass,
                {
                  isPageFlipped: "z-[55]",
                }
              )}
            >
              {items.map((item, index) => (
                <Page
                  key={`page-in-flip-book-${index}`}
                  isFlipped={visiblePageIndex > index}
                  onClick={() => {
                    if (visiblePageIndex && index < visiblePageIndex) {
                      handlePrevPage();
                    } else {
                      handleNextPage();
                    }
                  }}
                  content={item.content}
                  className={`absolute inset-0`}
                  style={{ zIndex: calculateZIndex(index) }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ width: "100%", height: "100%" }}
              animate={{ width: "100%", height: "100%" }}
              transition={{ duration: 0.8 }}
              exit={{ scale: 1 }}
              className={cn(
                "w-full h-full absolute bg-landing-page z-40 left-2 rounded-lg top-2",
                coverSizeClass
              )}
            />
          )}
          {isBookOpen ? (
            <motion.div
              onClick={() => {
                setIsBookOpen(false);
              }}
              initial={{ scale: 1 }}
              animate={{ width: "90vw", height: "100vh", left: 0, top: 0 }}
              transition={{ duration: 0.8 }}
              exit={{ scale: 1 }}
              className={cn(
                "w-full h-full absolute bg-landing-cover z-30 left-2 rounded-lg top-2",
                coverSizeClass
              )}
            />
          ) : (
            <Cover backCover className="z-20 left-4 top-4" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookPageFlip;
