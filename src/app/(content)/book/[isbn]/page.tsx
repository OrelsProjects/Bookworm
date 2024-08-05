"use client";

import React, { useEffect, useState } from "react";
import Modal from "../../../../components/modal/modal";
import { ModalTypes } from "../../../../lib/features/modal/modalSlice";
import ModalBookDetails from "../../../../components/modal/modalBookDetails";
import useBook from "../../../../hooks/useBook";
import { Book } from "../../../../models";
import { useModal } from "../../../../hooks/useModal";
import { useRouter } from "next/navigation";
import Loading from "../../../../components/ui/loading";

export default function BookPage({ params }: { params: { isbn: string } }) {
  const router = useRouter();
  const [bookData, setBookData] = useState<Book | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getBook } = useBook();
  const { showBookDetailsModal } = useModal();

  useEffect(() => {
    if (bookData) {
      showBookDetailsModal({ bookData });
    }
  }, [bookData]);

  const findBook = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const book = await getBook(params.isbn);
      setBookData(book);
    } catch (error: any) {
      router.push("/explore");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findBook();
  }, []);

  if (loading) {
    return <div className="w-full h-full flex justify-center items-center md:pb-48">
      <Loading spinnerClassName="w-20 h-20" text="We're looking for your book :)" />
    </div>;
  }

  // if (error || !bookData) {
  //   return <div>Error loading book {error}</div>;
  // }

  // return (
  //   <Modal isOpen type={ModalTypes.BOOK_DETAILS} topBarCollapsed={undefined}>
  //     <ModalBookDetails bookData={bookData} />
  //   </Modal>
  // );
}
