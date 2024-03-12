"use client";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../../lib/features/auth/authSlice";
import axios from "axios";
import { Logger } from "../../../logger";
import { IResponse } from "../../../models/dto/response";
import { SafeBooksListData } from "../../../models/booksList";
import { ModalTypes, showModal } from "../../../lib/features/modal/modalSlice";
import { Loading } from "../../../components";
import { useRouter } from "next/navigation";
import useBooksList from "../../../hooks/useBooksList";

export default function BooksListView({
  params,
}: {
  params: { listName: string };
}) {
  const { user } = useSelector(selectAuth);
  const { booksLists } = useBooksList();
  const router = useRouter();
  const dispatch = useDispatch();
  const loading = useRef(false);

  const loadBooksList = async () => {
    if (loading.current) return;
    loading.current = true;
    try {
      if (user) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
        axios.defaults.headers.common["user_id"] = user.userId;
      }
      const urlParams = new URLSearchParams();
      urlParams.append("url", params.listName);
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
      Logger.error("Error getting user book lists", {
        error,
      });
      router.push("/404");
    } finally {
      loading.current = false;
    }
  };

  useEffect(() => {
    loadBooksList();
  }, [params.listName]);

  if (loading.current) {
    return <Loading spinnerClassName="w-12 h-12" />;
  }
}
