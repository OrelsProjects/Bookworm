import React, { useMemo } from "react";
import { FaGlasses } from "react-icons/fa";
import { BiSolidPencil } from "react-icons/bi";
import { useSelector } from "react-redux";
import { ModalTypes, selectModal } from "../../../lib/features/modal/modalSlice";
import { BooksListData, SafeBooksListData } from "../../../models/booksList";
import { useModal } from "../../../hooks/useModal";
import useBooksList from "../../../hooks/useBooksList";
import { Switch } from "../../ui/switch";

export default function SwitchEditMode({
  safeBooksListData,
  onCheckedChange,
}: {
  safeBooksListData?: SafeBooksListData;
  onCheckedChange?: (value: boolean) => void;
}) {
  const { showBooksListEditModal, showBooksListModal } = useModal();
  const { booksLists } = useBooksList();
  const { modalStack } = useSelector(selectModal);
  const isOwner = useMemo(() => {
    return (
      booksLists &&
      safeBooksListData &&
      booksLists.some((list) => list.name === safeBooksListData.name)
    );
  }, [booksLists, safeBooksListData]);
  const isEdit = useMemo(() => {
    return (
      modalStack &&
      modalStack.length > 0 &&
      modalStack[0].type === ModalTypes.BOOKS_LIST_DETAILS_EDIT
    );
  }, [modalStack]);

  const handleOnChange = (value: boolean) => {
    if (!safeBooksListData) return;
    if (value && !isEdit) {
      const booksListData: BooksListData | undefined = booksLists.find(
        (list) => list.publicURL === safeBooksListData.publicURL
      );
      showBooksListEditModal(booksListData, {
        popLast: true,
        shouldAnimate: false,
      });
    } else if (!value && isEdit) {
      showBooksListModal(
        { bookList: safeBooksListData },
        { popLast: true, shouldAnimate: false }
      );
    }
  };

  return (
    isOwner &&
    safeBooksListData && (
      <div className="flex items-center justify-center gap-2">
        <span
          className={`text-base font-extralight ${
            isEdit ? "text-foreground font-light" : "text-muted"
          }`}
        >
          Edit
        </span>
        <Switch
          defaultChecked={isEdit}
          onCheckedChange={handleOnChange}
          checkedIcon={<BiSolidPencil />}
          uncheckedIcon={<FaGlasses />}
        />
      </div>
    )
  );
}