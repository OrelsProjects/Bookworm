import React, { useEffect, useMemo, useState } from "react";
import BookThumbnail from "../../book/bookThumbnail";
import { BurgerLines } from "../../icons/burgerLines";
import { BooksListViewProps } from "./consts";
import { useModal } from "../../../hooks/useModal";
import { getThumbnailSize } from "../../../consts/thumbnail";
import useBook from "../../../hooks/useBook";
import { toast } from "react-toastify";
import { Book } from "../../../models";
import {
  ReadingStatusEnum,
  readingStatusToName,
} from "../../../models/readingStatus";
import { Checkmark } from "../../icons/checkmark";
import { Bookmark } from "../../icons/bookmark";
import { isBookRead, isBookToRead } from "../../../models/userBook";
import { ErrorUnauthenticated } from "../../../models/errors/unauthenticatedError";
import SwitchEditMode from "../_components/switchEditMode";
import { BooksListData } from "../../../models/booksList";
import { BookInListWithBook } from "../../../models/bookInList";
import { Skeleton } from "../../ui/skeleton";
import BooksListThumbnail from "../../booksList/booksListThumbnail";
import GenresTabs from "../../genresTabs";
import ReadMoreText from "../../readMoreText";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { formatNumber, unslugifyText } from "../../../utils/textUtils";
import { BackButton } from "../modal";
import Rating from "../../rating";

const TopBarCollapsed = ({
  children,
  scrollRef,
}: {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
}) => {
  const [currentScrollPosition, setScrollPosition] = useState<number>(0);
  const [zIndex, setZIndex] = useState<number>(0);
  const handleScroll = () => {
    const scrollTop = scrollRef?.current?.scrollTop ?? 0;

    if (scrollTop > 120) {
      const scrolled = (scrollRef?.current?.scrollTop ?? 0) / 200;
      setScrollPosition(scrolled);
      // set zIndex up to 50, according to the scroll position. Normalized to 50
      setZIndex(Math.min(50, Math.floor(scrolled * 50)));
    } else {
      setScrollPosition(0);
    }
  };

  useEffect(() => {
    const scrollbar = scrollRef?.current;
    if (!scrollbar) return;
    scrollbar.addEventListener("scroll", handleScroll);
    return () => scrollbar.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  return (
    <div
      className="w-full h-fit absolute top-0 left-0 flex flex-row-reverse justify-start items-center"
      style={{ opacity: currentScrollPosition, zIndex }}
    >
      {children}
    </div>
  );
};

export function DesktopBooksListGridViewLoading() {
  const ListThumbnail = () => (
    <div className="w-full flex flex-row justify-start items-center gap-5">
      <Skeleton
        className={`${getThumbnailSize("xl").className} rounded-2xl`}
        type="shimmer"
      />
      <div className="h-full w-full flex flex-col justify-between py-2">
        <div className="w-full h-full flex flex-col gap-2">
          <Skeleton className="w-4/6 h-7 rounded-full" type="shimmer" />
          <Skeleton className="w-2/6 h-7 rounded-full" type="shimmer" />
        </div>
        <div className="w-full flex flex-row gap-4">
          {[1, 2, 3, 4].map(() => (
            <Skeleton className="w-28 h-10 rounded-full" type="shimmer" />
          ))}
        </div>
      </div>
    </div>
  );

  const ListComments = () => (
    <div className="w-full h-fit flex flex-col gap-1">
      <Skeleton className="w-full h-10 rounded-full" />
      <Skeleton className="w-full h-10 rounded-full" />
      <Skeleton className="w-full h-10 rounded-full" />
    </div>
  );
  const BooksInList = () => (
    <div className="w-full h-fit flex flex-col gap-[30px] ">
      <div className="w-72 h-fit flex flex-row justify-between">
        <Skeleton className="w-36 h-10 rounded-full" />
        <Skeleton className="w-20 h-10 rounded-full" />
      </div>
      <div
        className={`grid grid-cols-[repeat(var(--books-in-list-blocks-number),minmax(0,1fr))] gap-8 auto-rows-auto`}
      >
        {[0, 1, 2, 3, 4, 5, 6, 8, 9, 10].map((index) => (
          <div
            key={`book-in-list-${index}`}
            className={`flex flex-col justify-start items-start gap-2 w-full relative h-40 md:h-48 lg:h-56 xl:h-[260px] 2xl:h-[330px]

          `}
          >
            <Skeleton className={`w-full h-full rounded-2xl `} />
            <div className="w-full flex flex-col gap-1">
              <Skeleton className="w-full h-3 rounded-full" />
              <Skeleton className="w-[90%] h-3 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const BackButton = () => (
    <Skeleton className="w-24 h-10 rounded-full flex-shrink-0" />
  );

  return (
    <div className="h-full w-full hidden md:flex flex-col gap-5">
      <BackButton />
      <ListThumbnail />
      <ListComments />
      <BooksInList />
    </div>
  );
}

export default function DesktopBooksListGridView({
  safeBooksListData,
  topBarCollapsed,
  curator,
  loading,
  onClose,
}: BooksListViewProps & { onClose?: () => void } & { curator?: string } & {
  topBarCollapsed: React.ReactNode;
} & {
  loading?: boolean;
}) {
  const thumbnailSize = "2xl";

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const {
    addUserBook,
    userBooksData,
    deleteUserBook,
    getBookFullData,
    loading: loadingBook,
    updateBookReadingStatus,
  } = useBook();
  const { showBookDetailsModal, showBooksListEditModal, closeModal } =
    useModal();

  const [sortedBooksInList, setSortedBooksInList] = React.useState<
    BookInListWithBook[]
  >([]);

  useEffect(() => {
    const booksInlistSorted = [...(safeBooksListData?.booksInList ?? [])];
    booksInlistSorted.sort((a, b) => {
      return a.position - b.position;
    });
    setSortedBooksInList(booksInlistSorted);
  }, [safeBooksListData]);

  const booksRating = useMemo(() => {
    const booksRating: { [key: number]: number } = {};
    safeBooksListData?.booksInList?.forEach((bookInList) => {
      const bookData = getBookFullData(bookInList.book);
      booksRating[bookInList.book.bookId] =
        bookData?.goodreadsData?.goodreadsRating || 0;
    });
    return booksRating;
  }, [safeBooksListData]);

  const isRead = useMemo(() => {
    const booksIsRead: Record<number, boolean> = {};
    safeBooksListData?.booksInList?.forEach((bookInList) => {
      const bookData = getBookFullData(bookInList.book);
      booksIsRead[bookInList.book.bookId] = isBookRead(bookData?.userBook);
    });
    return booksIsRead;
  }, [userBooksData]);

  const booksReadCount = useMemo(() => {
    let count = 0;
    sortedBooksInList?.map((bookInList) => {
      const bookData = getBookFullData(bookInList.book);
      if (
        bookData?.bookData.book?.bookId &&
        isRead[bookData?.bookData.book?.bookId]
      ) {
        count++;
      }
    });
    return count;
  }, [sortedBooksInList]);

  const isToRead = useMemo(() => {
    const booksIsRead: Record<number, boolean> = {};
    safeBooksListData?.booksInList?.forEach((bookInList) => {
      const bookData = getBookFullData(bookInList.book);
      booksIsRead[bookInList.book.bookId] = isBookToRead(bookData?.userBook);
    });
    return booksIsRead;
  }, [userBooksData]);

  const handleUpdateBookReadingStatus = async (
    book: Book,
    status: ReadingStatusEnum
  ) => {
    if (loadingBook) return;
    const bookData = getBookFullData(book);
    let updateBookPromise: Promise<any> | undefined = undefined;
    let loadingMessage = "";
    let successMessage = "";
    let errorMessage = "";
    const readingStatusName = readingStatusToName(status);
    if (
      bookData?.userBook?.readingStatusId &&
      bookData?.userBook?.readingStatusId === status
    ) {
      updateBookPromise = deleteUserBook(bookData.userBook);
      loadingMessage = `Removing ${book?.title} from list ${readingStatusName}...`;
      successMessage = `${book?.title} removed from list ${readingStatusName}`;
      errorMessage = `Failed to remove ${book?.title} from list ${readingStatusName}`;
    } else {
      if (!bookData) {
        updateBookPromise = addUserBook({
          book,
          readingStatusId: status as number,
        });
      } else {
        updateBookPromise = updateBookReadingStatus(bookData.userBook, status);
      }
      loadingMessage = `Adding ${book?.title} to list: ${readingStatusName}...`;
      successMessage = `${book?.title} updated to list: ${readingStatusName}`;
      errorMessage = `Failed to add ${book?.title} to list: ${readingStatusName}`;
    }
    let loadingToast = toast.loading(loadingMessage);
    try {
      await updateBookPromise;
      toast.success(successMessage);
    } catch (e) {
      if (!(e instanceof ErrorUnauthenticated)) {
        toast.error(errorMessage);
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const isBooksListOwnedByUser = useMemo(() => {
    return (safeBooksListData as any)?.userId !== undefined;
  }, [safeBooksListData]);

  const booksListData: BooksListData = useMemo(
    () => safeBooksListData as any as BooksListData,
    [safeBooksListData]
  );

  const isOddNumberOfBooks = useMemo(
    () => (safeBooksListData?.booksInList?.length ?? 0) % 2 === 1,
    [safeBooksListData?.booksInList.length]
  );

  const lastIndexOfBooksInList = useMemo(
    () => (safeBooksListData?.booksInList?.length ?? 1) - 1,
    [safeBooksListData?.booksInList.length]
  );

  const ListHeader = () => (
    <div className="w-full flex flex-row items-center justify-start gap-32">
      <div className="w-fit flex flex-row items-center gap-2">
        <BurgerLines.Fill iconSize="sm" className="!text-foreground" />
        <div className="text-2xl flex flex-row gap-1 items-center justify-center">
          Book List
        </div>
      </div>
      {isBooksListOwnedByUser ? (
        <SwitchEditMode
          safeBooksListData={safeBooksListData}
          onCheckedChange={(checked) => {
            if (!checked) return;
            showBooksListEditModal(booksListData, {
              popLast: true,
              shouldAnimate: false,
            });
          }}
        />
      ) : (
        <div className="text-2xl">
          {booksReadCount}/{sortedBooksInList.length}
        </div>
      )}
    </div>
  );

  const ListComments = () => (
    <div className="w-full h-fit flex flex-col gap-1">
      <ReadMoreText
        className="text-[28px] font-light leading-[42px]"
        text={safeBooksListData?.description}
        maxLines={3}
      />
    </div>
  );

  const ListThumbnail = () => (
    <div className="w-full flex flex-row justify-start items-center gap-5">
      <BooksListThumbnail
        booksInList={safeBooksListData?.booksInList}
        thumbnailSize="xl"
      />
      <div className="h-full w-full flex flex-col justify-between py-2">
        <div className="w-full h-full flex flex-col">
          <span className="text-[32px] font-normal line-clamp-1">
            {safeBooksListData?.name}
          </span>
          <span className="text-[32px] font-normal line-clamp-1 text-muted opacity-70">
            {safeBooksListData?.curatorName}
          </span>
        </div>
        <div className="w-full flex flex-row gap-4">
          {safeBooksListData?.visitCount ? (
            <GenresTabs
              genres={[`${formatNumber(safeBooksListData.visitCount)} views`]}
              take={1}
              itemClassName="font-normal"
              selectable={false}
            />
          ) : (
            <></>
          )}
          <GenresTabs
            genres={safeBooksListData?.genres ?? []}
            take={3}
            itemClassName="font-normal"
            selectable={false}
          />
        </div>
      </div>
    </div>
  );

  const ThumbnailIcons = ({
    bookInList,
    className,
  }: {
    bookInList: BookInListWithBook;
    className?: string;
  }) => (
    <div
      className={cn(
        "w-full h-full md:h-fit absolute z-30 bottom-0 flex flex-row items-end justify-center gap-6 p-2",
        className
      )}
    >
      <motion.div
        className="h-fit w-fit p-2 px-2.5 rounded-full bg-background"
        whileHover={{ scale: 1.2 }}
      >
        <Bookmark.Fill
          onClick={(e) => {
            e.stopPropagation();
            handleUpdateBookReadingStatus(
              bookInList.book,
              ReadingStatusEnum.TO_READ
            );
          }}
          iconSize="xs"
          className={`
            ${
              isToRead[bookInList.book.bookId]
                ? "!text-primary"
                : "!text-foreground"
            }
            `}
        />
      </motion.div>
      <motion.div whileHover={{ scale: 1.2 }}>
        <Checkmark.Fill
          onClick={(e) => {
            e.stopPropagation();
            handleUpdateBookReadingStatus(
              bookInList.book,
              ReadingStatusEnum.READ
            );
          }}
          iconSize="md"
          className={`rounded-full p-1.5 ${
            isRead[bookInList.book.bookId]
              ? "!bg-primary !text-background"
              : "!bg-background !text-foreground"
          }`}
        />
      </motion.div>
    </div>
  );

  const ThumbnailHover = ({
    bookInList,
  }: {
    bookInList: BookInListWithBook;
  }) => {
    const [isHover, setIsHover] = useState(false);
    const scale = 1;

    return (
      <div
        className={`w-full h-full rounded-2xl absolute inset-0 ${
          isHover ? "z-40" : "z-20"
        }`}
      >
        <motion.div
          initial={{ scale: 1, opacity: 0 }}
          whileHover={{ scale, opacity: 1 }}
          onHoverStart={() => {
            setIsHover(true);
          }}
          onHoverEnd={() => {
            setIsHover(false);
          }}
          style={{ transformOrigin: "bottom" }}
          className="w-full h-full rounded-2xl hover:cursor-pointer"
        >
          <div className="absolute inset-0 bg-background/80 z-20 rounded-2xl border border-foreground" />
          <div className="absolute inset-0 z-10">
            <BookThumbnail
              book={bookInList.book}
              thumbnailSize={thumbnailSize}
              className="!w-full !h-full"
              containerClassName="!w-full !h-full"
            />
          </div>
          <div className="h-full w-full absolute inset-0 flex flex-col justify-between items-center gap-3 px-4 pt-5 pb-0 z-30 bg-transparent">
            <div className="h-full w-full flex flex-col justify-between items-center">
              <span className="w-full font-light line-clamp-6">
                {bookInList.book.description || bookInList.comments}
              </span>
              {booksRating[bookInList.book.bookId] > 0 && (
                <Rating
                  rating={booksRating[bookInList.book.bookId]}
                  startsContainerClassName="md:gap-0.5 md:w-full"
                  className="md:!gap-1"
                  starClassName="md:w-4 md:h-4"
                  textClassName="md:text-sm"
                />
              )}
              <div className="w-full flex flex-row justify-center items-center gap-1">
                {bookInList.book.genres?.slice(0, 1)?.map?.((genre, index) => (
                  <span
                    key={`genre-${index}`}
                    className="text-xs font-semibold bg-background border border-foreground rounded-full h-6 px-2 py-1 flex justify-center items-center line-clamp-1 truncate"
                  >
                    {unslugifyText(genre)}
                  </span>
                ))}
              </div>
            </div>
            <ThumbnailIcons bookInList={bookInList} className="!relative" />
          </div>
          {/* <Rating rating={bookInList.book.genres} /> */}
        </motion.div>
      </div>
    );
  };

  const Thumbnail = ({ bookInList }: { bookInList: BookInListWithBook }) => (
    <div className="w-full relative h-40 md:h-48 lg:h-[240px] 2xl:h-72">
      <BookThumbnail
        book={bookInList.book}
        thumbnailSize={thumbnailSize}
        loading="eager"
        Icon={<ThumbnailIcons bookInList={bookInList} />}
        className="!w-full !h-full"
        containerClassName="!w-full !h-full"
      />
      <ThumbnailHover bookInList={bookInList} />
    </div>
  );

  const BooksInList = () => (
    <div className="w-full grid grid-cols-[repeat(var(--books-in-list-blocks-number),minmax(0,1fr))] gap-8 auto-rows-auto pb-10">
      {sortedBooksInList.map((bookInList, index) => (
        <div
          key={`book-in-list-${index}`}
          className={`flex flex-col justify-start items-start gap-2 w-full
            ${
              isOddNumberOfBooks &&
              index === lastIndexOfBooksInList &&
              "mr-auto"
            }
            `}
          onClick={(e) => {
            e.stopPropagation();
            showBookDetailsModal({
              bookData: bookInList.book,
              bookInList,
              curator,
            });
            // scroll scrollRef to top
            scrollRef.current?.scrollTo(0, 0);
          }}
        >
          <Thumbnail bookInList={bookInList} />
          <div className="w-full">
            <div className="w-full text-lg leading-7 font-bold line-clamp-1">
              {bookInList.book.title}
            </div>
            <div className="w-full text-sm text-primary leading-5 truncate">
              {bookInList.book.authors?.join(", ")}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const Content = () =>
    loading ? (
      <DesktopBooksListGridViewLoading />
    ) : (
      <div className="w-full h-full relative px-auto flex flex-col gap-4 py-4">
        <BackButton
          onClick={() => {
            closeModal();
            onClose?.();
          }}
          className="justify-start md:top-0 md:relative md:left-0 z-20"
        />
        <TopBarCollapsed scrollRef={scrollRef}>
          <div className="w-full h-full relative flex justify-center">
            <BackButton
              onClick={() => {
                closeModal();
                onClose?.();
              }}
              className="!top-2.5 !left-0"
            />
            {topBarCollapsed}
          </div>
        </TopBarCollapsed>
        <div className="h-full w-full flex flex-col gap-10 relative">
          <ListThumbnail />
          <div className="h-full w-full flex flex-col gap-10">
            <ListComments />
            <ListHeader />
            <BooksInList />
          </div>
        </div>
      </div>
    );

  return (
    <motion.div
      // Move from bottom to top animation
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ y: "100%" }}
      className="h-full content-size mx-auto absolute inset-0 z-40 flex flex-col justify-start items-center gap-5 bg-background overflow-auto"
      ref={scrollRef}
    >
      <div className="w-full h-full">
        <Content />
      </div>
    </motion.div>
  );
}
