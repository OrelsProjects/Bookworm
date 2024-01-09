"use client";

import React, { useEffect, useState } from "react";
import useSearch, { UseSearchResult } from "../../hooks/useSearch";
import BookComponent, { SearchItemSkeleton } from "./bookComponent";
import { Book } from "../../models";
import toast from "react-hot-toast";
import useBook from "@/src/hooks/useBook";
import { useDispatch, useSelector } from "react-redux";
import { SearchBarComponent } from "./searchBarComponent";
import { RootState } from "@/src/lib/store";
import { Books, compareBooks } from "@/src/models/book";

const TOP_RESULTS_COUNT = 3;

export interface CustomSearchBarProps {
  item: React.ReactNode;
  onSearch: (text: string) => void;
}

export interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className }: SearchBarProps) => {
  const dispatch = useDispatch();
  const { addUserBook } = useBook();
  const { loading, error, updateSearchValue, books }: UseSearchResult =
    useSearch();
  const { userBooksData } = useSelector((state: RootState) => state.userBooks);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToShowInModal, setBookToShowInModal] = useState<Book | null>(null);
  const [loadingToastId, setLoadingToastId] = useState<string | null>(null);
  const [loadingAddBook, setLoadingAddBook] = useState<Book | null>(null);
  const [searchResultsInLibrary, setSearchResultsInLibrary] = useState<Books>(
    []
  );

  useEffect(() => {
    if (loadingAddBook) {
      const toastId = toast.loading(
        `Adding ${loadingAddBook.title} to library...`
      );
      setLoadingToastId(toastId);
    } else if (loadingToastId) {
      toast.dismiss(loadingToastId);
    }
  }, [loadingAddBook]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch books");
    }
  }, [error]);

  useEffect(() => {
    if (books) {
      const booksInLibrary = books.filter((book) =>
        userBooksData.some((userBookData) =>
          compareBooks(userBookData.bookData.book, book)
        )
      );
      setSearchResultsInLibrary(booksInLibrary);
    }
  }, [books]);

  const isBookInLibrary = (book: Book) =>
    searchResultsInLibrary.some((searchResult) =>
      compareBooks(searchResult, book)
    );

  const onSubmit = (value: string) => updateSearchValue(value);
  const onChange = (value: string) => updateSearchValue(value);

  const classItems = "px-6 py-4 rounded-t-3xl rounded-b-lg";
  const classNoItems = "rounded-full";

  return (
    <div className={`w-full h-full flex flex-col gap-4 ${className}`}>
      <SearchBarComponent
        onSubmit={onSubmit}
        onChange={onChange}
        className={books && books.length > 0 ? classItems : classNoItems}
      />
      <div className="flex flex-col gap-1 overflow-auto">
        {loading ? (
          <>
            <SearchItemSkeleton />
            <SearchItemSkeleton />
            <SearchItemSkeleton />
          </>
        ) : (
          books &&
          books.length > 0 && (
            <>
              <div>Top {TOP_RESULTS_COUNT} Results</div>
              {books.map(
                (book, i) =>
                  i < TOP_RESULTS_COUNT && (
                    <BookComponent
                      key={
                        book.title +
                        book.isbn10 +
                        book.datePublished +
                        book.isbn
                      }
                      book={book}
                      isBookInLibrary={isBookInLibrary(book)}
                    />
                  )
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default SearchBar;
