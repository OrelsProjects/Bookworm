import { Book } from "@/src/models";
import { Tooltip } from "react-tooltip";
import ModalTooltip from "./modalTooltip";

const BookDescription = ({ book }: { book: Book | null }): React.ReactNode => {
  return (
    <div className="flex flex-col flex-wrap gap-2 w-full">
      <p
        className="text-md line-clamp-3 font-thin"
        data-tooltip-id="tooltip-description"
        data-for="path"
      >
        {book?.description}
      </p>
      <ModalTooltip id="tooltip-description" place="top">
        {book?.description}
      </ModalTooltip>
    </div>
  );
};

export default BookDescription;
