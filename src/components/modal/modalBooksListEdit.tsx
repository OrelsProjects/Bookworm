import React, { useEffect, useState } from "react";
import {
  BooksListData,
  booksListDataToSafeBooksListData,
} from "../../models/booksList";
import { ThumbnailSize } from "../../consts/thumbnail";
import BooksListThumbnail from "../booksList/booksListThumbnail";
import { useFormik } from "formik";
import { Books } from "../../models/book";
import { ModalContent } from "./modalContainers";
import { CommentsArea } from "./_components/commentsArea";
import SwitchEditMode from "./_components/switchEditMode";
import ContentEditBookList from "./_components/contentEditBookList";
import { useModal } from "../../hooks/useModal";

interface ModalBooksListProps {
  booksListData?: BooksListData;
}

const Thumbnail: React.FC<{
  books?: Books;
  thumbnailSize: ThumbnailSize;
  loading?: boolean;
}> = ({ books, thumbnailSize, loading }) => (
  <BooksListThumbnail
    books={books}
    thumbnailSize={thumbnailSize}
    loading={loading}
  />
);

export const buildFormikValueName = (bookId: number) =>
  `newBookComments-${bookId}`;

const ModalBooksListEdit: React.FC<ModalBooksListProps> = ({
  booksListData,
}) => {
  const { showBooksListModal } = useModal();
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

  useEffect(() => {
    setCurrentBookList(booksListData);
    booksListData?.booksInList?.forEach((bookInList) => {
      formik.setFieldValue(
        buildFormikValueName(bookInList.bookId),
        bookInList.comments
      );
    });
  }, [booksListData]);

  return (
    <ModalContent
      thumbnail={
        <Thumbnail
          books={currentBooksList?.booksInList?.map(
            (bookInList) => bookInList.book
          )}
          thumbnailSize="lg"
        />
      }
      thumbnailDetails={
        <div className="flex flex-col w-full gap-2">
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
          />
        </div>
      }
      buttonsRow={
        <div className="w-full flex items-center justify-end">
          <SwitchEditMode
            safeBooksListData={booksListDataToSafeBooksListData(booksListData)}
            onCheckedChange={(checked) => {
              if (!checked) {
                const bookList =
                  booksListDataToSafeBooksListData(currentBooksList);
                if (!bookList) return;
                showBooksListModal(
                  {
                    bookList,
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
      bottomSection={ContentEditBookList({ booksListData })}
    ></ModalContent>
  );
};

export default ModalBooksListEdit;
