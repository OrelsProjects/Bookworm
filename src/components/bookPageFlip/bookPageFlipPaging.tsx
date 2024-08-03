import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { cn } from "../../lib/utils";

interface BookPageFlipPagingProps {
  pagesCount: number;
  currentPage?: number;
  className?: string;
  onBookClose: () => void;
  onPageChange: (page: number) => void;
}

const Arrow = ({
  direction,
  onClick,
  className,
}: {
  direction: "left" | "right";
  className?: string;
  onClick: () => void;
}) => (
  <div
    className={cn(
      "hover:cursor-pointer flex justify-center items-center border border-black h-[50px] w-[50px] rounded-full",
      {
        "transform rotate-180": direction === "right",
      },
      className
    )}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    <FaArrowLeft className="w-[17px] h-[15px] text-black hover:cursor-pointer" />
  </div>
);

const Progress = ({
  pagesCount,
  currentPage,
  onPageClick,
}: {
  pagesCount: number;
  currentPage: number;
  onPageClick: (page: number) => void;
}) => (
  <div className="flex gap-2">
    {Array.from({ length: pagesCount }, (_, i) => i).map((page) => (
      <div
        key={`book-page-flip-paging-page-${page}`}
        className={cn(
          "bg-transparent hover:cursor-pointer w-[18px] h-[18px] border border-black rounded-full",
          {
            "bg-black": page === currentPage,
          }
        )}
        onClick={(e) => {
          e.stopPropagation();
          onPageClick(page);
        }}
      />
    ))}
  </div>
);

const BookPageFlipPaging: React.FC<BookPageFlipPagingProps> = ({
  pagesCount,
  onPageChange,
  onBookClose,
  currentPage = 0,
  className,
}) => {
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    onPageChange(page);
  }, [page]);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (page < pagesCount - 1) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    } else {
      onBookClose();
    }
  };

  const shouldShowBackButton = useMemo(() => page > 0, [page]);

  const shouldShowNextButton = useMemo(() => page < pagesCount - 1, [page]);

  return (
    <div
      className={cn(
        "flex justify-between items-center w-full h-[50px]",
        className
      )}
    >
      <Arrow direction="left" onClick={handlePrevPage} />
      <Progress
        pagesCount={pagesCount}
        currentPage={page}
        onPageClick={setPage}
      />
      <Arrow
        direction="right"
        onClick={handleNextPage}
        className={`${shouldShowNextButton ? "" : "invisible"}`}
      />
    </div>
  );
};

export default BookPageFlipPaging;
