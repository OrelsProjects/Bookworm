import { Book } from "@/src/models";
import ModalTooltip from "./modalTooltip";

const BookTitle = ({ book }: { book: Book | null }): React.ReactNode => {
  const Title = (): React.ReactNode => (
    <div className="flex flex-col flex-wrap gap-2 w-full">
      <p className="text-3xl line-clamp-1">{book?.title}</p>
      <p className="text-lg font-thin">{book?.subtitle}</p>
    </div>
  );

  return (
    <div
      className="flex flex-col flex-wrap gap-2 w-full"
      data-tooltip-id="tooltip-title"
      data-for="path"
    >
      <Title />
      <ModalTooltip id="tooltip-title" place="top">
        {book?.title}
      </ModalTooltip>
    </div>
  );
};

export default BookTitle;
