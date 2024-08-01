"use client";

import React, { useEffect, useState } from "react";
import Modal from "../../../../components/modal/modal";
import { ModalTypes } from "../../../../lib/features/modal/modalSlice";
import ModalBookDetails from "../../../../components/modal/modalBookDetails";
import useBook from "../../../../hooks/useBook";
import { Book } from "../../../../models";

export default function BookPage({ params }: { params: { isbn: string } }) {
  const [bookData, setBookData] = useState<Book | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getBook } = useBook();

  const findBook = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const book = await getBook(params.isbn);
      debugger;
      setBookData(book);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findBook();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !bookData) {
    return <div>Error loading book {error}</div>;
  }

  return (
    <Modal isOpen type={ModalTypes.BOOK_DETAILS} topBarCollapsed={undefined}>
      <ModalBookDetails bookData={bookData} />
    </Modal>
  );
}
