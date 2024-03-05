import React, { useState } from "react";
import { Add, Bookmark } from "../icons";
import BooksListThumbnail from "./booksListThumbnail";
import { Book } from "../../models";
import { Input } from "../input";
import { ThumbnailSize } from "../../consts/thumbnail";
import { TextArea } from "../textarea";

type AddBookToListProps = {
  book?: Book;
  defaultComment?: string;
  onAddNewBookClick?: () => void;
  onCommentChange?: (comment: string) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const AddBookToList: React.FC<AddBookToListProps> = ({
  book,
  defaultComment,
  onAddNewBookClick,
  onCommentChange,
}) => {
  const [comment, setComment] = useState<string>(defaultComment ?? "");

  return (
    <div className="w-full flex flex-row gap-2 justify-start items-center">
      <BooksListThumbnail
        onClick={onAddNewBookClick}
        className="flex-shrink-0"
        Icon={
          !book && (
            <div className="absolute-center">
              <Add.Fill className="!text-background" />
            </div>
          )
        }
        books={book ? [book] : []}
        thumbnailSize={ThumbnailSize.Small}
      />

      <div className="w-full grid gap-2">
        <div className={`${book ? "text-foreground" : "text-muted"}`}>
          {book ? book.title : "Book Name"}
        </div>

        <TextArea
          value={comment}
          onChange={(e) => {
            const value = e.target.value;
            e.stopPropagation();
            setComment(value);
            onCommentChange?.(value);
          }}
          placeholder="Comment"
          className="h-max border-1 rounded-md"
          rows={3}
        />
      </div>
    </div>
  );
};

export default AddBookToList;
