"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "../input";
import useSearch, { UseSearchResult } from "../../hooks/useSearch";
import SearchItem, { SearchItemSkeleton } from "./searchItem";
import { Book } from "../../models";
import toast from "react-hot-toast";
import useBook from "@/src/hooks/useBook";
import { useDispatch } from "react-redux";
import { ModalTypes, showModal } from "@/src/lib/features/modal/modalSlice";
import { SearchBarComponent } from "./searchBarComponent";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToShowInModal, setBookToShowInModal] = useState<Book | null>(null);
  const [loadingToastId, setLoadingToastId] = useState<string | null>(null);
  const [loadingAddBook, setLoadingAddBook] = useState<Book | null>(null);

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

  const addToLibrary = async (book: Book) => {
    try {
      if (loadingAddBook) {
        return;
      }
      setLoadingAddBook(book);
      await addUserBook(book);
      toast.success("Book added to library!");
    } catch (error) {
      toast.error("Error adding book to library!");
    } finally {
      setLoadingAddBook(null);
    }
  };

  const onSubmit = (value: string) => updateSearchValue(value);
  const onChange = (value: string) => updateSearchValue(value);

  const classItems = "px-6 py-4 rounded-t-3xl rounded-b-lg";
  const classNoItems = "rounded-full";

  return (
    <div className="w-full h-full flex flex-col gap-4">
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
                    <SearchItem
                      key={
                        book.title +
                        book.isbn10 +
                        book.datePublished +
                        book.isbn
                      } // isbn/isbn10 might be null
                      book={book}
                      onAddToLibrary={(book) => {
                        addToLibrary(book);
                      }}
                    />
                  )
              )}
            </>
          )
        )}
      </div>
      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        {bookToShowInModal && (
          <BookDetails book={bookToShowInModal} className="w-full h-full" />
        )}
      </Modal> */}
    </div>
  );
};

export default SearchBar;
