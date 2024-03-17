"use client";

import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Logger } from "../../../logger";
import { IResponse } from "../../../models/dto/response";
import { SafeBooksListData } from "../../../models/booksList";
import { ModalTypes, showModal } from "../../../lib/features/modal/modalSlice";
import Loading from "../../../components/loading";
import { useRouter } from "next/navigation";

export default function BooksListView({
  params,
}: {
  params: { listUrl: string };
}) {
  const router = useRouter();
  const dispatch = useDispatch();
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
      dispatch(
        showModal({ type: ModalTypes.BOOKS_LIST_DETAILS, data: bookList })
      );
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
