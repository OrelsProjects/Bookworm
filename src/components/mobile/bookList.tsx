import Image from "next/image";
import { useEffect, useState } from "react";
import { Book } from "../../models";
import { Books } from "../../models/book";
import axios from "axios";

// Book component that takes the book data as props
const BookComponent = ({ book }: { book: Book }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md`}
      style={{ backgroundColor: book.thumbnailColor }}
    >
      {book.thumbnailUrl && (
        <div className="w-24 h-36 relative mb-4">
          <Image
            src={book.thumbnailUrl}
            alt={book.title}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
      )}
      <div className="text-left">
        <div className="text-md font-bold text-gray-800">{book.title}</div>
        <p className="text-gray-600">
          {book.authors && book.authors.join(", ")}
        </p>
        <p className="text-gray-500 text-sm mt-2">{book.description}</p>
      </div>
    </div>
  );
};

// BookList component that renders a list of books
const BookListComponent = ({ books }: { books: Books }) => {
  return (
    <div className="">
      {/* {books.map((book) => (
        <BookComponent key={book.bookId} book={book} />
      ))} */}
    </div>
  );
};

export default BookListComponent;
