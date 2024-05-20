import React, { useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import BookPageFlipPaging from "./bookPageFlipPaging";
import Link from "next/link";

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
  "w-[320px] md:w-[563px] lg:w-[563px] md:max-w-[563px] lg:max-w-[563px] h-[480px] md:h-[825px] md:max-h-[825px] lg:h-[825px] lg:max-h-[825px] ";
const pageSizeClass =
  "w-full md:w-[543px] lg:w-[543px] md:max-w-[543px] lg:max-w-[543px] h-full md:h-[805px] md:max-h-[60805pxpx] lg:h-[805px] lg:max-h-[805px]";

const BackCover = ({
  isFlipped,
  className,
}: {
  isFlipped?: boolean;
  className?: string;
}) => (
  <Cover
    isFlipped={isFlipped}
    className={`${className} !cursor-default`}
    backCover
  />
);

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
        "w-full rounded-lg flex flex-col justify-center items-center relative bg-landing-cover shadow-xl overflow-clip cursor-pointer",
        coverSizeClass,
        { isFlipped: "bg-landing-cover-brighter" },
        className
      )}
      style={{
        transition: "all 1s ease", // Adjust timing and easing here
        transformOrigin: "left center", // Set transform origin to left center
        transform:
          isFlipped && !backCover ? "rotateY(180deg)" : "rotateY(0deg)", // Rotate based on flipped state
        height: isFlipped ? "100svh" : "100%",
      }}
    >
      {!backCover && (
        <div
          className={`w-full h-full ${
            showBack ? "opacity-10" : "opacity-100"
          } flex justify-between items-center flex-col pt-4`}
        >
          <>
            <h1 className="text-background text-6.5xl">BookWiz</h1>
            <h3 className="text-foreground text-2xl">Reading With Purpose</h3>
          </>
          <Image
            src="/landing-cover-half.png"
            alt="landing-cover"
            fill
            className="!w-full object-cover rounded-lg !relative"
          />
        </div>
      )}
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
    transition: "all 1.2s ease-out", // Adjust timing and easing here
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
      <div className={`w-full h-full flex ${isFlipped ? "opacity-30" : ""}`}>
        {content}
      </div>
    </div>
  );
};

const BookPageFlip: React.FC<BookPageFlipProps> = ({
  items,
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
    if (visiblePageIndex < items.length - 1) {
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
        "w-full h-full flex items-center justify-center gap-12 font-risque transition-all overflow-clip",
        { "!items-start md:!items-center": isBookOpen }
      )}
    >
      <div
        className={cn(
          coverSizeClass,
          "ml-[43px] mr-[57px] relative flex flex-col justify-center items-center"
        )}
      >
        {/* Front cover */}
        <motion.div
          className="w-full h-full"
          // initial={{ marginTop: "25%" }}
          // animate={isBookOpen ? { marginTop: "0" } : { marginTop: "25%" }}
        >
          <Cover
            onClick={handleCoverClick}
            isFlipped={isBookOpen}
            className={cn(
              `transition-transform duration-1000 ease-out translate-z-10 absolute inset-0 ${
                visiblePageIndex === -1 ? "z-50" : "z-30"
              }`
            )}
          />
          {/* Pages */}
          {isBookOpen ? (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ width: "86vw", height: "98svh", left: 6, top: 7 }}
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
                  className={`absolute inset-0 !px-[30px] md:!px-[43px] pb-[calc(50px+22px+22px)]`}
                  style={{ zIndex: calculateZIndex(index) }}
                />
              ))}
              <div className="z-[65] w-full h-fit absolute bottom-0 flex justify-center items-center">
                <BookPageFlipPaging
                  pagesCount={items.length}
                  onPageChange={(pageNumber: number) =>
                    setVisiblePageIndex(pageNumber)
                  }
                  currentPage={visiblePageIndex}
                  onBookClose={handleCloseBook}
                  className="!px-[30px] md:!px-[43px] my-[23px] "
                />
              </div>
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
          {/* Pages */}
          {/* Back cover */}
          <AnimatePresence mode="wait">
            {isBookOpen && (
              <motion.div
                key={`back-cover`}
                initial={{ scale: 1 }}
                animate={{ width: "90vw", height: "100svh", left: 0, top: 0 }}
                exit={{ scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={cn(
                  "w-full h-full absolute bg-landing-cover z-30 left-2 rounded-lg top-2",
                  coverSizeClass
                )}
              />
            )}
          </AnimatePresence>
          {!isBookOpen && <BackCover className="z-20 left-4 top-4" />}
        </motion.div>
      </div>
    </div>
  );
};

export default BookPageFlip;
