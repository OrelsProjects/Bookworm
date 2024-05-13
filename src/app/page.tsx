"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import BookPageFlip, {
  BookPageFlipItemProps,
} from "../components/bookPageFlip/BookPageFlip";

const Paging = ({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) => {
  const [page, setPage] = React.useState(1);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => {
              setPage(page - 1);
              onPrev();
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive={page === 1}>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive={page === 2}>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => {
              setPage(page + 1);
              onNext();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

function App() {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isPageFlipped, setIsPageFlipped] = React.useState(false);
  const [isPageFlipped1, setIsPageFlipped1] = React.useState(false);
  const [isPageFlipped2, setIsPageFlipped2] = React.useState(false);

  const items: BookPageFlipItemProps[] = [
    {
      content: (
        <div className="w-full h-full flex flex-start justify-center items-start gap-6 bg-foreground text-background rounded-lg">
          This is page number 1
        </div>
      ),
    },
    {
      content: (
        <div className="w-full h-full flex flex-start justify-center items-start gap-6 bg-foreground text-background rounded-lg">
          This is page number 2
        </div>
      ),
    },
    {
      content: (
        <div className="w-full h-full flex flex-start justify-center items-start gap-6 bg-foreground text-background rounded-lg">
          This is page number 3
        </div>
      ),
    },
  ];

  return <BookPageFlip items={items} />;
}

export default App;
