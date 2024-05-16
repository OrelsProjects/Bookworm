"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SafeBooksListData } from "@/src/models/booksList";
import useBooksList from "@/src/hooks/useBooksList";
import { useModal } from "@/src/hooks/useModal";

interface BooksListsPageProps {
  params: { listUrl: string };
}

const BooksListsPage: React.FC<BooksListsPageProps> = ({
  params,
}: {
  params: { listUrl: string };
}) => {
  const router = useRouter();
  const { showBooksListModal, closeModal } = useModal();
  const { getBooksList } = useBooksList();
  const [booksList, setBooksList] = useState<SafeBooksListData | undefined>();
  const [loadingBooksList, setLoadingBooksList] = useState(true);

  useEffect(() => {
    if (!booksList && !loadingBooksList) {
      closeModal();
      router.push("/404");
    } else if (booksList) {
      closeModal();
      showBooksListModal({ booksList });
    }
  }, [booksList]);

  useEffect(() => {
    const loadBooksList = async () => {
      try {
        showBooksListModal({}, { loading: true });
        const booksListResponse = await getBooksList(`${params.listUrl}`);
        setBooksList(booksListResponse);
      } catch (error: any) {
        console.error("Error getting books lists", {
          error,
        });
      } finally {
        setLoadingBooksList(false);
      }
    };
    loadBooksList();
  }, [params.listUrl]);

  if (!booksList && !loadingBooksList) {
    router.push("/404");
  }
  return <div className="w-full h-full hidden md:flex ">HI</div>;
};

export default BooksListsPage;
