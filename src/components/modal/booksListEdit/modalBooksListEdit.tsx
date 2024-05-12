import React, { useContext, useEffect, useState } from "react";
import {
  BooksListData,
  booksListDataToSafeBooksListData,
} from "../../../models/booksList";
import { ThumbnailSize } from "../../../consts/thumbnail";
import BooksListThumbnail from "../../booksList/booksListThumbnail";
import { useFormik } from "formik";
import { ModalContent } from "../modalContainers";
import { CommentsArea } from "../_components/commentsArea";
import SwitchEditMode from "../_components/switchEditMode";
import ContentEditBookList from "./contentEditBookList";
import { useModal } from "../../../hooks/useModal";
import { BurgerLines } from "../../icons/burgerLines";
import useBooksList from "../../../hooks/useBooksList";
import { BookInListWithBook } from "../../../models/bookInList";

interface ModalBooksListProps {
  booksListData?: BooksListData;
}

const Thumbnail: React.FC<{
  booksListId: string;
  thumbnailSize: ThumbnailSize;
  loading?: boolean;
}> = ({ booksListId, thumbnailSize, loading }) => {
  const { booksLists } = useBooksList();
  const [books, setBooks] = useState<BookInListWithBook[] | undefined>();

  useEffect(() => {
    const booksList = booksLists.find(
      (booksList) => booksList.listId === booksListId
    );
    if (booksList) {
      setBooks(booksList.booksInList);
    }
  }, [booksListId, booksLists]);

  return (
    <BooksListThumbnail
      booksInList={books}
      thumbnailSize={thumbnailSize}
      loading={loading}
    />
  );
};

export const buildFormikValueName = (bookId: number) =>
  `newBookComments-${bookId}`;

const ModalBooksListEdit: React.FC<ModalBooksListProps> = ({
  booksListData,
}) => {
  const { showBooksListModal, showBooksListEditModal } = useModal();
  const [currentBooksList, setCurrentBookList] = useState<
    BooksListData | undefined
  >();
  const formik = useFormik({
    initialValues: {
      listName: booksListData?.name ?? "",
      newListDescription: booksListData?.description ?? "",
      newBookComments: "",
    },
    onSubmit: (values) => {},
  });

  const handleNewListCreated = (booksListData: BooksListData) => {
    showBooksListEditModal(booksListData, {
      shouldAnimate: false,
      popLast: true,
    });
  };
  const updateBooksList = (booksListData?: BooksListData) => {
    setCurrentBookList(booksListData);
    booksListData?.booksInList?.forEach((bookInList) => {
      formik.setFieldValue(
        buildFormikValueName(bookInList.bookId),
        bookInList.comments
      );
    });
  };

  useEffect(() => {
    updateBooksList(booksListData);
  }, [booksListData]);

  return (
    <ModalContent
      thumbnail={
        <Thumbnail
          booksListId={currentBooksList?.listId ?? ""}
          thumbnailSize="xl"
        />
      }
      thumbnailDetails={
        <div className="flex flex-col w-full gap-2 -mb-2">
          <CommentsArea
            key={`${currentBooksList?.listId}-title`}
            value={booksListData ? undefined : formik.values.listName}
            onChange={
              booksListData
                ? undefined
                : (e) => {
                    formik.setFieldValue("listName", e.target.value);
                  }
            }
            name="listName"
            bookListData={currentBooksList}
            className="w-full"
            listName
            rows={1}
            error={formik.errors.listName}
            placeholder="List name"
          />
          <CommentsArea
            key={`${currentBooksList?.listId}-description`}
            name="listComments"
            onChange={(e) => {
              formik.setFieldValue("newListDescription", e.target.value);
            }}
            bookListData={currentBooksList}
            className="w-full"
            rows={2}
          />
        </div>
      }
      buttonsRow={
        <div className="w-full flex items-center justify-between mt-6">
          <div className="w-fit flex flex-row items-center gap-2">
            <BurgerLines.Fill iconSize="sm" className="!text-foreground" />
            <div className="font-bold text-xl flex flex-row gap-1 items-center justify-center">
              Book List{" "}
              {booksListData?.booksInList &&
              booksListData.booksInList.length > 0 ? (
                <div className="text-muted font-normal">
                  ({booksListData.booksInList.length})
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <SwitchEditMode
            safeBooksListData={booksListDataToSafeBooksListData(booksListData)}
            onCheckedChange={(checked) => {
              if (!checked) {
                const bookList =
                  booksListDataToSafeBooksListData(currentBooksList);
                if (!bookList) return;
                showBooksListModal(
                  {
                    booksList: bookList,
                  },
                  {
                    popLast: true,
                    shouldAnimate: false,
                  }
                );
              }
            }}
          />
        </div>
      }
      bottomSection={ContentEditBookList({
        initialBooksListId: currentBooksList?.listId ?? "",
        listName: formik.values.listName,
        newListDescription: formik.values.newListDescription,
        onNewListCreated: (booksListData: BooksListData) => {
          handleNewListCreated(booksListData);
          // updateBooksList(booksListData);
        },
      })}
    ></ModalContent>
  );
};

export default ModalBooksListEdit;
