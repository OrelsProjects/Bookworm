"use client";

import React, { useEffect, useRef } from "react";
import axios from "axios";
import { Logger } from "../../../logger";
import { IResponse } from "../../../models/dto/response";
import { SafeBooksListData } from "../../../models/booksList";
import Loading from "../../../components/ui/loading";
import { useRouter } from "next/navigation";
import { useModal } from "../../../hooks/useModal";

export default function BooksListView({
  params,
}: {
  params: { listUrl: string };
}) {
  const { showBooksListModal } = useModal();
  const router = useRouter();
  const loading = useRef(false);

  const loadBooksList = async () => {
    if (loading.current) return;
    loading.current = true;
    try {
      const urlParams = new URLSearchParams();
      urlParams.append("url", params.listUrl);
      const response = await axios.get<IResponse<SafeBooksListData>>(
        "/api/list",
        {
          params: urlParams,
        }
      );
      const bookList = response.data.result;
      if (bookList) {
        showBooksListModal({ bookList });
      }
    } catch (error: any) {
      Logger.error("Error getting books lists", {
        error,
      });
      router.push("/404");
    } finally {
      loading.current = false;
    }
  };

  useEffect(() => {
    loadBooksList();
  }, [params.listUrl]);

  if (loading.current) {
    return <Loading spinnerClassName="w-12 h-12" />;
  }
}
