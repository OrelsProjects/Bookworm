"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useBooksList from "../../../hooks/useBooksList";
import { ModalTypes, showModal } from "../../../lib/features/modal/modalSlice";

const MyListSpecific = ({ params }: { params: { listId: string } }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { booksLists } = useBooksList();

  useEffect(() => {

    const currentList = booksLists.find(
      (list) => list.listId === params.listId
    );
    if (!currentList) {
      router.push("/my-lists");
    } else {
      dispatch(
        showModal({ type: ModalTypes.BOOKS_LIST_DETAILS, data: currentList })
      );
    }
  }, [booksLists, params.listId]);
};

export default MyListSpecific;
