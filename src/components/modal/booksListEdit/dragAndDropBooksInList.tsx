import React from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { BookInListWithBook } from "../../../models/bookInList";
import BooksListThumbnail from "../../booksList/booksListThumbnail";
import { Add } from "../../icons/add";
import { TextArea } from "../../ui/textarea";
import { ListBookAndBookDetailsProps } from "./contentEditBookList";
import BookThumbnail from "../../book/bookThumbnail";
import { Cancel } from "../../icons/cancel";
import GripLines from "../../icons/gripLines";
import { CommentsArea } from "../_components/commentsArea";

interface ListBookProps extends ListBookAndBookDetailsProps {
  booksInList?: BookInListWithBook[];
  onPositionChange: (booksInListWithBook: BookInListWithBook[]) => void;
  onNewBookClick: () => void;
}

interface BookInListDetailsProps extends ListBookAndBookDetailsProps {
  bookInList?: BookInListWithBook;
  position: number;
}

const BookInListDetails: React.FC<BookInListDetailsProps> = ({
  key,
  name,
  position,
  onChange,
  bookInList,
  onDeleteBookClick,
}) => {
  return (
    <div className="w-full flex flex-row gap-2 justify-start items-start relative">
      <div className="flex flex-col justify-center items-center text-sm absolute -left-6 top-1/3">
        <div className="">#{position}</div>
        <GripLines className="!text-foreground w-4 h-4" />
      </div>
      <BookThumbnail
        book={bookInList?.book}
        className="flex-shrink-0"
        Icon={
          <div className="absolute-center overflow-hidden rounded-full">
            {bookInList?.book ? (
              <Cancel.Fill
                className="!text-foreground !bg-background border-none rounded-full p-1"
                iconSize="md"
                key={`delete-book-${bookInList.book.bookId}`}
                onClick={() => onDeleteBookClick(bookInList)}
              />
            ) : (
              <Add.Outline iconClassName="!text-foreground" iconSize="md" />
            )}
          </div>
        }
        thumbnailSize="md"
      />

      <div className="w-full h-full flex flex-col justify-start items-start gap-2">
        <div
          className={`${
            bookInList ? "text-foreground" : "text-muted"
          } h-fit line-clamp-1`}
        >
          {bookInList?.book?.title ?? "Book Name"}
        </div>
        <CommentsArea
          key={key}
          name={name}
          bookInList={bookInList}
          onChanged={(comments: string) => {
            onChange(bookInList, comments);
          }}
        />
      </div>
    </div>
  );
};

const ListBooks: React.FC<ListBookProps> = ({
  value,
  onChange,
  onNewBookClick,
  onPositionChange,
  onAddNewBookClick,
  onDeleteBookClick,
  name,
  booksInList,
}) => {
  return (
    <div className="w-full flex flex-col gap-2 justify-center items-start">
      <DragDropContext
        onDragEnd={(result: DropResult) => {
          const draggedBookInList = booksInList?.[result.source.index];
          const destinationIndex = result.destination?.index;
          if (!draggedBookInList) return;
          if (destinationIndex === undefined) return;
          if (destinationIndex === result.source.index) return;

          const newBooksInList = [...booksInList];
          newBooksInList.splice(result.source.index, 1);
          newBooksInList.splice(destinationIndex, 0, draggedBookInList);
          const booksListWithUpdatedIndexes = newBooksInList.map(
            (bookInList, index) => ({
              ...bookInList,
              position: index,
            })
          );
          onPositionChange(booksListWithUpdatedIndexes);
        }}
      >
        <Droppable droppableId="droppable-books-in-list">
          {(provided) => (
            <ul
              className="w-full flex flex-col justify-center items-start gap-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {booksInList?.map((bookInList, index) => (
                <Draggable
                  key={`draggable-id-book-in-modal-books-list-${bookInList.bookId}`}
                  draggableId={`draggable-id-book-in-modal-books-list-${bookInList.bookId}`}
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="w-full"
                    >
                      <BookInListDetails
                        bookInList={bookInList}
                        onAddNewBookClick={onAddNewBookClick}
                        onDeleteBookClick={onDeleteBookClick}
                        onChange={onChange}
                        value={value}
                        name={`${name}-${bookInList.bookId}`}
                        position={index + 1}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div className="w-full flex flex-row gap-2" onClick={onNewBookClick}>
        <BooksListThumbnail
          className="flex-shrink-0"
          Icon={
            <div className="absolute-center">
              <Add.Fill
                className="!text-foreground !bg-background border-none rounded-full p-1"
                iconSize="md"
                onClick={onAddNewBookClick}
              />
            </div>
          }
          thumbnailSize="md"
        />

        <div className="w-full h-full flex flex-col justify-start items-start gap-2">
          <div className={`text-muted h-fit`}>Book Name</div>
          <TextArea
            value={value}
            rows={3}
            name={name}
            onChange={(e) => {
              onChange(null, e.target.value);
            }}
            placeholder="Comment"
            key={`new-book-comment-input`}
          />
        </div>
      </div>
    </div>
  );
};

export default ListBooks;
