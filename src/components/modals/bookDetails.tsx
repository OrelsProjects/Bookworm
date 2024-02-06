import { Book, UserBook, UserBookData } from "@/src/models";
import React, { useEffect, useState } from "react";
import Rating from "../rating";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import {
  FavoriteButton,
  AddToBacklogButton,
  AddToReadListButton,
  DeleteButton,
} from "../buttons/bookButtons";
import { formatDate } from "@/src/utils/dateUtils";
import useBook from "@/src/hooks/useBook";
import { compareBooks } from "@/src/models/book";
import toast from "react-hot-toast";
import BookThumbnail from "../bookThumbnail";
import { Logger } from "@/src/logger";
import { hideModal } from "@/src/lib/features/modal/modalSlice";

export interface BookDescriptionProps {
  book: Book | undefined;
  className?: string;
  onFavorite?: () => void;
  onAddToBacklog?: () => void;
  onAddToReadList?: () => void;
}

export function BookDetails({
  book,
  className,
}: BookDescriptionProps): React.ReactNode {
  const dispatch = useDispatch();
  const { favoriteBook, deleteUserBook, getBookGoodreadsData } = useBook();
  const [bookToShow, setBookToShow] = useState<Book | null>(null); // To avoid bugs when closing the modal
  const [goodreadsData, setGoodreadsData] = useState<any>(null);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingGoodreadsData, setGoodreadsDataLoading] = useState(false);
  const [userBookData, setUserBookData] = useState<UserBookData | undefined>();
  const userBooksData: UserBookData[] = useSelector(
    (state: RootState) => state.userBooks.userBooksData
  );

  const loadBookGoodreadsData = async () => {
    if (!book) {
      return;
    }

    if (loadingGoodreadsData) {
      return;
    }
    setGoodreadsDataLoading(true);

    try {
      const result = await getBookGoodreadsData(book);
      setGoodreadsData(result);
    } catch (error: any) {
      Logger.error("Failed to load goodreads data", {
        data: book,
        error,
      });
    } finally {
      setGoodreadsDataLoading(false);
    }
  };

  useEffect(() => {
    if (book) {
      setBookToShow(book);
    }
  }, [book]);

  useEffect(() => {
    const userBookData = userBooksData.find((userBookData) =>
      compareBooks(userBookData?.bookData.book, book)
    );
    setUserBookData(userBookData);
    setGoodreadsData(userBookData?.goodreadsData);

    if (!userBookData || !userBookData?.goodreadsData) {
      loadBookGoodreadsData();
    }
  }, [userBooksData]);

  const onFavorite = async (userBook: UserBook) => {
    try {
      setLoadingFavorite(true);
      await favoriteBook(userBook);
    } catch (error: any) {
      Logger.error("Failed to favorite book", {
        data: userBook,
        error,
      });
      toast.error("Something went wrong.. We're on it!");
    } finally {
      setLoadingFavorite(false);
    }
  };

  const onDeleteBook = async (userBook: UserBook) => {
    try {
      setLoadingDelete(true);
      await deleteUserBook(userBook);
      dispatch(hideModal());
    } catch (error: any) {
      Logger.error("Failed to delete book", {
        data: userBook,
        error,
      });
      toast.error("Something went wrong.. We're on it!");
    } finally {
      setLoadingDelete(false);
    }
  };

  const BookTitle = (): React.ReactNode => {
    return (
      <div className="flex flex-col flex-wrap gap-2 w-full">
        <p className="text-3xl line-clamp-1">{bookToShow?.title}</p>
        <p className="text-lg font-thin">{bookToShow?.subtitle}</p>
      </div>
    );
  };

  const BookDescription = (): React.ReactNode => {
    return (
      <div className="flex flex-col flex-wrap gap-2 w-full">
        <p className="text-md line-clamp-3 font-thin">
          {bookToShow?.description}
        </p>
      </div>
    );
  };

  const AuthorsAndPages = (): React.ReactNode => {
    return (
      <div className="flex flex-col">
        <p className="text-md text-primary">
          {bookToShow?.authors?.join(", ")}
        </p>
        <p className="text-md font-thin">{bookToShow?.numberOfPages} Pages</p>
      </div>
    );
  };

  const PublishDate = (): React.ReactNode => {
    return (
      <div className="flex flex-col">
        <p className="text-md">
          Published:{" "}
          {formatDate(bookToShow?.datePublished, false, false, false)}
        </p>
      </div>
    );
  };

  const NotesSection = ({
    title,
    body,
  }: {
    title: string;
    body: React.ReactNode;
  }): React.ReactNode => (
    <div className="font-thin w-full flex flex-col">
      <div className="text-base line-clamp-2">{title}</div>
      <div className="text-xl line-clamp-5">{body}</div>
    </div>
  );

  const RecommendationSource = (): React.ReactNode => {
    return (
      userBookData?.userBook.suggestionSource && (
        <div className="flex flex-col gap-6 text-foreground w-1/2 font-thin">
          <NotesSection
            title="Who recommended me this book?"
            body={userBookData?.userBook.suggestionSource ?? ""}
          />
        </div>
      )
    );
  };

  const AfterReadingSection = (): React.ReactNode => {
    return (
      userBookData?.userBook.readingStatusId !== 1 && (
        <div className="flex flex-col gap-6 text-foreground text-5xl w-1/2 font-thin">
          {userBookData?.userBook.userRating && (
            <NotesSection
              title="I've rated this book with"
              body={
                <Rating
                  userRating={userBookData?.userBook.userRating}
                  className="!p-0 !m-0"
                />
              }
            />
          )}
          {userBookData?.userBook.userComments && (
            <NotesSection
              title="My personal thoughts after reading"
              body={userBookData?.userBook.userComments}
            />
          )}
        </div>
      )
    );
  };

  const Notes = (): React.ReactNode => {
    return (
      <div className="w-full bg-primary-foreground rounded-lg flex flex-col gap-6 justify-start items-start p-8 shadow-lg">
        <div className="text-5xl w-full">My notes</div>
        <div className="flex flex-row w-full">
          <RecommendationSource />
          <AfterReadingSection />
        </div>
      </div>
    );
  };

  const ButtonsSection = (): React.ReactNode => (
    <div className="flex flex-row items-end gap-2">
      {userBookData && userBookData.readingStatus?.readingStatusId === 1 ? (
        <FavoriteButton
          loading={loadingFavorite}
          onClick={() => onFavorite(userBookData?.userBook)}
          isFavorite={userBookData?.userBook.isFavorite ?? false}
        />
      ) : (
        book && <AddToBacklogButton book={book} />
      )}
      {userBookData &&
        userBookData?.readingStatus?.readingStatusId !== 1 &&
        book && <AddToReadListButton book={book} />}
      {userBookData && (
        <DeleteButton
          loading={loadingDelete}
          onClick={() => onDeleteBook(userBookData?.userBook)}
        />
      )}
    </div>
  );

  return (
    <div
      className={`flex flex-col gap-6 overflow-auto scrollbar-hide ${className}`}
    >
      <div className="flex flex-row modal-background shadow-lg">
        <div className="flex items-center flex-row gap-8 2xl:w-10/12 xl:10/12 lg:w-9/12">
          <BookThumbnail
            src={bookToShow?.thumbnailUrl}
            placeholder="blur"
            blurDataURL="/thumbnailPlaceholder.png"
            fill
            className="rounded-lg !relative xl:!w-64 xl:!h-80 lg:!w-56 lg:!h-72 md:!w-48 md:!h-64 sm:!w-40 sm:!h-56 xs:!w-32 xs:!h-48"
          />
          <div className="flex flex-col gap-4 flex-1">
            <BookTitle />
            <BookDescription />
            <AuthorsAndPages />
            <PublishDate />
            <Rating
              loading={loadingGoodreadsData}
              rating={goodreadsData?.goodreadsRating}
              totalRatings={goodreadsData?.goodreadsRatingsCount}
              userRating={userBookData?.userBook.userRating}
              goodreadsUrl={goodreadsData?.goodreadsUrl}
            />
          </div>
        </div>
        <div className="h-full flex flex-grow w-fit justify-end">
          <ButtonsSection />
        </div>
      </div>
      {userBookData && <Notes />}
    </div>
  );
}

export default BookDetails;
