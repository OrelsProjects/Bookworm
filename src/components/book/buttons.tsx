import React, { useEffect } from "react";
import { Add, Bookmark, Checkmark } from "../icons";
import { Book, UserBookData } from "../../models";
import useBook from "../../hooks/useBook";
import { isBookRead } from "../../models/userBook";

type BookButtonsProps = {
  book?: Book;
};

const ButtonImage = (
  title: string,
  Icon: React.ElementType,
  selected: boolean,
  width: number = 35,
  height: number = 35
) => (
  <div className={`flex flex-col justify-center items-center gap-2 `}>
    <Icon
      style={{ height, width }}
      className={`${selected ? "!text-primary" : "!text-foreground"}`}
    />
    <div className="text-foreground text-lg">{title}</div>
  </div>
);

const BookButtons: React.FC<BookButtonsProps> = ({ book }) => {
  const { getBookFullData } = useBook();
  const [bookData, setBookData] = React.useState<UserBookData | undefined>();
  const [bookRead, setBookRead] = React.useState(false);

  useEffect(() => {
    const userBookData = getBookFullData(book) ?? undefined;
    setBookData(userBookData);
    setBookRead(isBookRead(userBookData?.userBook));
  }, [book]);

  return (
    <div className="h-24 flex flex-row justify-evenly items-center gap-4">
      {ButtonImage("Read", Add.Fill, bookRead && !!bookData)}
      {ButtonImage("To Read", Bookmark.Fill, !bookRead && !!bookData, 24)}
      {bookRead && ButtonImage("Add to list", Checkmark.Outline, false)}{" "}
      {/* TODO: Fix */}
    </div>
  );
};

export default BookButtons;
