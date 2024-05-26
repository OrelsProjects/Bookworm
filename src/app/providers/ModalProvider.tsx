"use client";

import React, { useCallback, useContext, useEffect, useMemo } from "react";
import {
  ModalData,
  ModalState,
  ModalTypes,
  ShowModalOptions,
  hideModal,
} from "@/src/lib/features/modal/modalSlice";
import { RootState } from "@/src/lib/store";
import { Book } from "@/src/models";
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
import { ModalBooksList } from "../../components/modal/booksList/modalBooksList";
import ModalSignup from "../../components/modal/modalSignup";
import BookThumbnail from "../../components/book/bookThumbnail";
import BooksListThumbnail from "../../components/booksList/booksListThumbnail";
import ModalContext from "../../lib/context/modalContext";
import { Logger } from "../../logger";
import axios from "axios";
import {
  BookInListVisit,
  BookVisit,
  ListVisit,
} from "../../models/statistics/visit";
import DesktopBooksListGridView from "../../components/modal/booksList/desktopGridView";
import { cn } from "../../../lib/utils";

const ModalProvider: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const modalContext = useContext(ModalContext);
  const { modalStack }: ModalState = useSelector(
    (state: RootState) => state.modal
  );
  const dispatch = useDispatch();

  const [previousModalStack, setPreviousModalStack] = React.useState<
    ModalData[]
  >([]);

  const isNewModalAdded = useMemo<boolean>(
    () =>
      modalStack.length > 0 && previousModalStack.length < modalStack.length,
    [modalStack]
  );

  const isPreviousModalIsList = useMemo<boolean>(() => {
    return (
      modalStack.length > 1 &&
      modalStack[modalStack.length - 2].type === ModalTypes.BOOKS_LIST_DETAILS
    );
  }, [modalStack]);

  useEffect(() => {
    try {
      if (isNewModalAdded) {
        const now = new Date();
        switch (modalStack[modalStack.length - 1].type) {
          case ModalTypes.BOOK_DETAILS:
            const bookId = (
              modalStack[modalStack.length - 1].data as ModalBookDetailsProps
            ).bookData.bookId;
            if (isPreviousModalIsList) {
              const listId =
                previousModalStack[previousModalStack.length - 1].data.booksList
                  .listId;
              const bookInListVisit: BookInListVisit = {
                bookId,
                listId,
                visitedAt: now,
              };
              axios.post("/api/statistics/visit/book-in-list", bookInListVisit);
            } else {
              const bookVisit: BookVisit = {
                bookId,
                visitedAt: now,
              };

              axios.post("/api/statistics/visit/book", bookVisit);
            }
          case ModalTypes.BOOKS_LIST_DETAILS:
            const booksListVisit: ListVisit = {
              listId: modalStack[modalStack.length - 1].data.booksList.listId,
              visitedAt: now,
            };
            axios.post("/api/statistics/visit/list", booksListVisit);
        }
      }
    } catch (e: any) {
      Logger.error(e);
    } finally {
      setPreviousModalStack(modalStack);
    }
  }, [modalStack]);

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
    const defaultColor = "rgb(225,225,225)";
    let color = defaultColor;
    switch (type) {
      case ModalTypes.BOOK_DETAILS:
        color =
          darkenColor(
            (data as ModalBookDetailsProps)?.bookData?.thumbnailColor
          ) ?? defaultColor;
        break;
      case ModalTypes.BOOKS_LIST_DETAILS_EDIT:
        const firstBookEdit = data?.booksInList?.[0]?.book;
        color = darkenColor(firstBookEdit?.thumbnailColor) ?? defaultColor;
        break;
      case ModalTypes.BOOKS_LIST_DETAILS:
        const firstBook = data?.booksList?.booksInList?.[0]?.book;
        color = darkenColor(firstBook?.thumbnailColor) ?? defaultColor;
        break;
      case ModalTypes.ADD_BOOK_TO_LIST:
        color = darkenColor(data?.thumbnailColor) ?? defaultColor;
        break;
      default:
        color = defaultColor;
    }
    modalContext[type] = color;
    return color;
  }, [type, data]);

  const topBarCollapsed = useMemo<React.ReactNode>(() => {
    const thumbnailSize = "2xs";
    const rounded = "!rounded-md";
    let thumbnail: React.ReactNode;
    let title: string = "";
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
        const booksInList = data?.booksList?.booksInList;
        thumbnail = (
          <BooksListThumbnail
            booksInList={booksInList}
            thumbnailSize={thumbnailSize}
            className={rounded}
          />
        );
        title = data?.booksList?.name ?? "";
        break;
      default:
        thumbnail = undefined;
    }
    if (!thumbnail || !title) {
      return undefined;
    }
    return (
      <div
        className={cn(
          "w-full h-14 md:h-fit md:py-2 bg-background flex flex-row md:flex-row-reverse justify-between md:justify-center items-center gap-3 px-4",
          "md:!bg-card"
        )}
        style={{ backgroundColor: modalBackgroundColor }}
      >
        <div className="ml-10 md:ml-0 text-lg md:text-2xl md:font-semibold text-foreground max-w-xs md:max-w-md line-clamp-1">
          {title}
        </div>
        <div>{thumbnail}</div>
      </div>
    );
  }, [type, data]);

  const RenderBooksListDetails = useCallback(
    (data?: any, options?: ShowModalOptions, className?: string) => {
      let onBack = options?.onBack;
      if (!options?.loading) {
        const currentPath = window.location.pathname;

        if (!currentPath.includes(data.booksList.publicURL)) {
          window.history.pushState({}, "", data.booksList.publicURL);
        }

        onBack = () => {
          if (options?.fromUrl && !options?.fromUrl.includes(currentPath)) {
            window.history.pushState({}, "", options.fromUrl);
          } else {
            router.push("/explore");
          }
        };
      }

      return (
        <>
          <RenderModal
            onClose={onBack}
            type={ModalTypes.BOOKS_LIST_DETAILS}
            shouldAnimate={options?.shouldAnimate ?? true}
            className={cn("md:hidden", className)}
          >
            <ModalBooksList
              safeBooksListData={data.booksList}
              loading={options?.loading}
            />
          </RenderModal>
          <DesktopBooksListGridView
            onClose={onBack}
            topBarCollapsed={topBarCollapsed}
            safeBooksListData={data.booksList}
            loading={options?.loading}
          />
        </>
      );
    },
    [shouldRenderBooksListDetailsModal, topBarCollapsed]
  );

  const RenderBooksListDetailsEdit = (
    booksListData?: BooksListData,
    options?: ShowModalOptions,
    className?: string
  ) => {
    return (
      <RenderModal
        type={ModalTypes.BOOKS_LIST_DETAILS_EDIT}
        shouldAnimate={options?.shouldAnimate ?? true}
        className={className}
      >
        <ModalBooksListEdit booksListData={booksListData} />
      </RenderModal>
    );
  };

  const RenderBookDetails = useCallback(
    (data?: ModalBookDetailsProps, className?: string) =>
      data && (
        <RenderModal type={ModalTypes.BOOK_DETAILS} className={className}>
          <ModalBookDetails {...data} />
        </RenderModal>
      ),
    [shouldRenderBookDetailsModal]
  );

  const RenderAddBookToList = useCallback(
    (book?: Book, className?: string) => {
      return (
        book && (
          <RenderModal type={ModalTypes.ADD_BOOK_TO_LIST} className={className}>
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
    type,
    onClose,
    children,
    className,
    shouldAnimate = true,
  }: {
    type: ModalTypes;
    className?: string;
    onClose?: () => void;
    shouldAnimate?: boolean;
    children: React.ReactNode;
  }) => {
    const isOpen = useMemo<boolean>(
      () => modalStack.some((modal) => modal.type === type),
      [modalStack]
    );
    return (
      <Modal
        isOpen={isOpen}
        type={type}
        onClose={() => {
          onClose?.();
          handleOnClose();
        }}
        topBarCollapsed={topBarCollapsed}
        backgroundColor={modalBackgroundColor}
        shouldAnimate={shouldAnimate}
        key={`modal-${type}`}
        className={className}
      >
        {children}
      </Modal>
    );
  };

  const RenderComponent = useCallback(
    ({
      modalData,
      className,
    }: {
      modalData: ModalData;
      className?: string;
    }) => {
      switch (modalData.type) {
        case ModalTypes.BOOK_DETAILS:
          return RenderBookDetails(modalData.data, className);
        case ModalTypes.BOOKS_LIST_DETAILS:
          return RenderBooksListDetails(
            modalData.data,
            modalData.options,
            className
          );
        case ModalTypes.BOOKS_LIST_DETAILS_EDIT:
          return RenderBooksListDetailsEdit(
            modalData.data,
            modalData.options,
            className
          );
        case ModalTypes.ADD_BOOK_TO_LIST:
          return RenderAddBookToList(modalData.data, className);
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
          key={`modal-${modalData.type}-${Math.random()}`}
          className={className}
        />
      ))}
      <RenderRegisterModal />
    </>
  );
};

export default ModalProvider;
