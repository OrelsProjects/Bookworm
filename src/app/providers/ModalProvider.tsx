"use client";

import {
  ModalData,
  ModalState,
  ModalTypes,
  ShowModalOptions,
  hideModal,
} from "@/src/lib/features/modal/modalSlice";
import { RootState } from "@/src/lib/store";
import { Book } from "@/src/models";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalBookDetails, {
  ModalBookDetailsProps,
} from "../../components/modal/modalBookDetails";
import Modal from "../../components/modal/modal";
import { BooksListData } from "../../models/booksList";
import { darkenColor } from "../../utils/thumbnailUtils";
import ModalAddBookToList from "../../components/modal/addBookToList/modalAddBookToList";
import ModalBooksListEdit from "../../components/modal/booksListEdit/modalBooksListEdit";
import { usePathname, useRouter } from "next/navigation";
import { BookInList, BookInListWithBook } from "../../models/bookInList";
import { ModalBooksList } from "../../components/modal/booksList/modalBooksList";
import ModalSignup from "../../components/modal/modalSignup";
import BookThumbnail from "../../components/book/bookThumbnail";
import BooksListThumbnail from "../../components/booksList/booksListThumbnail";
import Tooltip from "../../components/ui/tooltip";
import { Books } from "../../models/book";

const ModalProvider: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { modalStack }: ModalState = useSelector(
    (state: RootState) => state.modal
  );
  const dispatch = useDispatch();

  useEffect(() => {}, [window.location.href]);

  const { data, type } = useMemo(
    () => modalStack[modalStack.length - 1] ?? {},
    [modalStack]
  );

  // TODO: The problem with the modal not animating on close is because I hide it here (useMemos) and then it's removed from the DOM. I need to hide it in the modalSlice, and then remove it from the DOM after the animation is done.

  const shouldRenderBookDetailsModal = useMemo<boolean>(() => {
    return modalStack
      .map((modalData) => modalData.type)
      .includes(ModalTypes.BOOK_DETAILS);
  }, [modalStack]);

  const shouldRenderBooksListDetailsModal = useMemo<boolean>(() => {
    return modalStack
      .map((modalData) => modalData.type)
      .includes(ModalTypes.BOOKS_LIST_DETAILS);
  }, [modalStack]);

  const shouldRenderBooksListDetailsEditModal = useMemo<boolean>(() => {
    return modalStack
      .map((modalData) => modalData.type)
      .includes(ModalTypes.BOOKS_LIST_DETAILS_EDIT);
  }, [modalStack]);

  const shouldRenderAddBookToListModal = useMemo<boolean>(() => {
    return modalStack
      .map((modalData) => modalData.type)
      .includes(ModalTypes.ADD_BOOK_TO_LIST);
  }, [modalStack]);

  const modalBackgroundColor = useMemo<string>((): string => {
    const defaultColor = "rgb(180,180,180)";
    switch (type) {
      case ModalTypes.BOOK_DETAILS:
        return (
          darkenColor(
            (data as ModalBookDetailsProps)?.bookData?.thumbnailColor
          ) ?? defaultColor
        );
      case ModalTypes.BOOKS_LIST_DETAILS_EDIT:
        const firstBookEdit = data?.booksInList?.[0]?.book;
        return darkenColor(firstBookEdit?.thumbnailColor) ?? defaultColor;
      case ModalTypes.BOOKS_LIST_DETAILS:
        const firstBook = data?.bookList.booksInList?.[0]?.book;
        return darkenColor(firstBook?.thumbnailColor) ?? defaultColor;
      case ModalTypes.ADD_BOOK_TO_LIST:
        return darkenColor(data?.thumbnailColor) ?? defaultColor;
      default:
        return defaultColor;
    }
  }, [type, data]);

  const topBarCollapsed = useMemo<React.ReactNode>(() => {
    const thumbnailSize = "2xs";
    const rounded = "!rounded-md";
    let thumbnail: React.ReactNode;
    let title: string = "";
    let books: Books = [];
    switch (type) {
      case ModalTypes.BOOK_DETAILS:
        const bookData = (data as ModalBookDetailsProps).bookData;
        thumbnail = (
          <BookThumbnail
            src={bookData?.thumbnailUrl}
            thumbnailSize={thumbnailSize}
            className={rounded}
          />
        );
        title = bookData.title ?? "";
        break;
      case ModalTypes.ADD_BOOK_TO_LIST:
        thumbnail = (
          <BookThumbnail
            src={data?.thumbnailUrl}
            thumbnailSize={thumbnailSize}
            className={rounded}
          />
        );
        title = data?.title ?? "";
        break;
      case ModalTypes.BOOKS_LIST_DETAILS_EDIT:
        title = data?.name ?? "";
        thumbnail = (
          <BooksListThumbnail
            booksInList={data?.booksInList}
            thumbnailSize={thumbnailSize}
            className={rounded}
          />
        );
        break;
      case ModalTypes.BOOKS_LIST_DETAILS:
        books =
          data?.bookList?.booksInList?.map(
            (bookInList: BookInListWithBook) => bookInList.book
          ) ?? [];
        thumbnail = (
          <BooksListThumbnail
            booksInList={data?.booksInList}
            thumbnailSize={thumbnailSize}
            className={rounded}
          />
        );
        title = data?.bookList?.name ?? "";
        break;
      default:
        thumbnail = <></>;
    }
    return (
      <div
        className="w-full h-14 bg-background flex justify-between items-center gap-3 px-4"
        style={{ backgroundColor: modalBackgroundColor }}
      >
        <div className="ml-10 text-lg text-foreground max-w-xs line-clamp-1">
          {title}
        </div>
        <div>{thumbnail}</div>
      </div>
    );
  }, [type, data]);

  const RenderBooksListDetails = useCallback(
    (data?: any, options?: ShowModalOptions) => {
      return (
        <RenderModal
          onClose={data.onBack}
          type={ModalTypes.BOOKS_LIST_DETAILS}
          shouldAnimate={options?.shouldAnimate ?? true}
        >
          <ModalBooksList safeBooksListData={data.bookList} />
        </RenderModal>
      );
    },
    [shouldRenderBooksListDetailsModal]
  );

  const RenderBooksListDetailsEdit = (
    booksListData?: BooksListData,
    options?: ShowModalOptions
  ) => {
    return (
      <RenderModal
        type={ModalTypes.BOOKS_LIST_DETAILS_EDIT}
        shouldAnimate={options?.shouldAnimate ?? true}
      >
        <ModalBooksListEdit booksListData={booksListData} />
      </RenderModal>
    );
  };

  const RenderBookDetails = useCallback(
    (data?: ModalBookDetailsProps) =>
      data && (
        <RenderModal type={ModalTypes.BOOK_DETAILS}>
          <ModalBookDetails {...data} />
        </RenderModal>
      ),
    [shouldRenderBookDetailsModal]
  );

  const RenderAddBookToList = useCallback(
    (book?: Book) => {
      return (
        book && (
          <RenderModal type={ModalTypes.ADD_BOOK_TO_LIST}>
            <ModalAddBookToList book={book} />
          </RenderModal>
        )
      );
    },
    [shouldRenderAddBookToListModal]
  );

  const RenderRegisterModal = useCallback(() => {
    const shouldShow = modalStack
      .map((modalData) => modalData.type)
      .includes(ModalTypes.REGISTER);

    return shouldShow && <ModalSignup />;
  }, [modalStack]);

  const RenderModal = ({
    children,
    type,
    onClose,
    shouldAnimate = true,
  }: {
    children: React.ReactNode;
    type: ModalTypes;
    onClose?: () => void;
    shouldAnimate?: boolean;
  }) => {
    const isOpen = useMemo<boolean>(
      () => modalStack.some((modal) => modal.type === type),
      [modalStack]
    );
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose?.();
          handleOnClose();
        }}
        topBarCollapsed={topBarCollapsed}
        backgroundColor={modalBackgroundColor}
        shouldAnimate={shouldAnimate}
        key={`modal-${type}`}
      >
        {children}
      </Modal>
    );
  };

  const RenderComponent = useCallback(
    ({ modalData }: { modalData: ModalData }) => {
      switch (modalData.type) {
        case ModalTypes.BOOK_DETAILS:
          return RenderBookDetails(modalData.data);
        case ModalTypes.BOOKS_LIST_DETAILS:
          return RenderBooksListDetails(modalData.data, modalData.options);
        case ModalTypes.BOOKS_LIST_DETAILS_EDIT:
          return RenderBooksListDetailsEdit(modalData.data, modalData.options);
        case ModalTypes.ADD_BOOK_TO_LIST:
          return RenderAddBookToList(modalData.data);
        default:
          return null;
      }
    },
    [
      RenderBookDetails,
      RenderBooksListDetails,
      RenderBooksListDetailsEdit,
      RenderAddBookToList,
    ]
  );

  const handleOnClose = useCallback(() => {
    dispatch(hideModal());
  }, [pathname, router, dispatch]);

  return (
    <>
      {modalStack.map((modalData) => (
        <RenderComponent
          modalData={modalData}
          key={`modal-${modalData.type}`}
        />
      ))}
      <RenderRegisterModal />
    </>
  );
};

export default ModalProvider;
