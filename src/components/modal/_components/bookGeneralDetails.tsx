import React from "react";
import Rating from "../../rating";
import MarqueeText from "../../ui/marquee";
import Tooltip from "../../ui/tooltip";
import ModalTitle from "../../book/bookTitle";
import ModalAuthors from "../../book/authors";

const BookGeneralDetails: React.FC<{
  title?: string | null;
  authors?: string[] | null;
  goodreadsRating?: number | null;
}> = ({ title, authors, goodreadsRating }) => (
  <div className="h-full md:h-fit w-full flex flex-col gap-4 mt-2.5 md:flex-shrink-0">
    <div className="h-full w-full flex flex-col">
      <Tooltip
        tooltipContent={
          <div className="w-full font text-foreground line-clamp-4">
            {title}
          </div>
        }
      >
        <ModalTitle title={title ?? ""} />
      </Tooltip>
      <ModalAuthors
        authors={authors || []}
        className="!text-muted text-lg md:text-[40px] leading-10 md:line-clamp-none font-normal"
      />
    </div>
    <Rating rating={goodreadsRating} />
  </div>
);

export default BookGeneralDetails;
