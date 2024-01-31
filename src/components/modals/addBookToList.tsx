import React, { useState } from "react";
import { Book, UserBook, UserBookData } from "@/src/models";
import { RatingStar } from "../rating";
import { TextArea } from "../textarea";
import { FavoriteButton } from "../buttons/bookButtons";
import { Button } from "../button";
import useBook from "@/src/hooks/useBook";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { ReadingStatusEnum } from "@/src/models/readingStatus";
import toast from "react-hot-toast";
import Loading from "../loading";
import { compareBooks } from "@/src/models/book";
import { Input } from "../input";
import { hideModal } from "@/src/lib/features/modal/modalSlice";
import BookThumbnail from "../bookThumbnail";
import { z } from "zod";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Logger } from "@/src/logger";

export enum ListType {
  BACKLOG,
  READ,
}

interface AddBookToListProps {
  book: Book;
  type: ListType;
}

const AddBookToList: React.FC<AddBookToListProps> = ({ book, type }) => {
  const { updateUserBook, addUserBook, loading } = useBook();
  const dispatch = useDispatch();
  const userBooksData: UserBookData[] = useSelector(
    (state: RootState) => state.userBooks.userBooksData
  );

  const [ratingSelected, setRatingSelected] = useState<number>(0);
  const [comments, setComments] = useState<string>("");
  const [suggestionSource, setSuggestionSource] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const addBookToList = async () => {
    switch (type) {
      case ListType.BACKLOG:
        await addBookToBacklog();
        break;
      case ListType.READ:
        await addBookToReadList();
        break;
      default:
        break;
    }
  };

  const addBookToBacklog = async () => {
    debugger;
    const toastId = toast.loading(`Adding ${book.title} to backlog`);
    try {
      await addUserBook(
        book,
        isFavorite,
        suggestionSource,
        comments,
        new Date()
      );
      toast.success("Book added to backlog");
      dispatch(hideModal());
    } catch (error: any) {
      Logger.error("Error adding book to backlog:", {
        data: book,
        error,
      });
      toast.error("Something went wrong");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const addBookToReadList = async () => {
    debugger;
    let toastId = toast.loading(`Adding ${book.title} to read list`);
    try {
      const userBook: UserBook | undefined = userBooksData.find(
        (userBookData) => compareBooks(userBookData.bookData.book, book)
      )?.userBook;

      if (!userBook) {
        return;
      }

      await updateUserBook({
        userBookId: userBook.userBookId,
        readingStatusId: ReadingStatusEnum.READ,
        userRating: ratingSelected,
        userComments: comments,
        isFavorite: isFavorite,
      });
      toast.success("Book added to read list");
      dispatch(hideModal());
    } catch (error: any) {
      Logger.error("Error adding book to read list:", {
        data: book,
        error,
      });
      toast.error("Something went wrong");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const Title = (): React.ReactNode => (
    <div className="title">{book.title}</div>
  );

  const Description = (): React.ReactNode => (
    <div className="line-clamp-4">{book.description}</div>
  );

  const RatingArea = (): React.ReactNode => {
    const Star = ({
      index,
      filled = false,
    }: {
      index: number;
      filled?: boolean;
    }) => (
      <RatingStar
        key={`rating-star-${index}`}
        imageFill
        filled={filled}
        user
        className="!w-5 !h-5 !relative cursor-pointer"
        onClick={() => setRatingSelected(index + 1)}
      />
    );

    return (
      <div className="flex flex-col">
        <div className="text font-semibold">What's your rating?</div>
        <div className="flex flex-row gap-0.5">
          {[...Array(5)].map((_, index) => (
            <Star
              key={`rating-star-${index}`}
              index={index}
              filled={index < ratingSelected}
            />
          ))}
        </div>
      </div>
    );
  };

  const commentsText = (): string => {
    switch (type) {
      case ListType.BACKLOG:
        return "Comments (optional)";
      case ListType.READ:
        return "Comments after reading (optional)";
      default:
        return "";
    }
  };

  const commentsPlaceholder = (): string => {
    switch (type) {
      case ListType.BACKLOG:
        return "Harry Potter";
      case ListType.READ:
        return "The book was great!";
      default:
        return "";
    }
  };

  const CommentsArea = () => (
    <Formik
      initialValues={{ comments: "" }}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);
        setComments(values.comments);
      }}
    >
      {() => (
        <Form className="w-comments h-36">
          <label htmlFor="comments" className="">
            Comments after reading (optional)
          </label>
          <Field
            as="textarea"
            name="comments"
            id="comments-after-read"
            className="w-full h-full p-2 bg-primary-weak rounded-lg text-foreground placeholder-gray-500/70 focus:outline-none border-none resize-none"
            placeholder={commentsPlaceholder()}
          />
          <ErrorMessage name="comments" component="div" />
        </Form>
      )}
    </Formik>
  );

  const SuggestionSource = () => (
    <Formik
      initialValues={{ suggestionSource: "" }}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);
        setSuggestionSource(values.suggestionSource);
      }}
    >
      {() => (
        <Form
          className="w-comments"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="suggestion-source" className="">
            Who recommended this book to you?
          </label>
          <Field
            type="text"
            name="suggestionSource"
            id="suggestion-source"
            className="w-full p-2 bg-primary-weak rounded-lg text-foreground placeholder-gray-500/70 focus:outline-none border-none"
            placeholder="Enter name or source"
          />
          <ErrorMessage name="suggestionSource" component="div" />
        </Form>
      )}
    </Formik>
  );

  const MainSection = (): React.ReactNode => (
    <div className="h-full w-1/2 flex flex-col justify-center items-start my-4 gap-4">
      <Title />
      <Description />
      {type === ListType.BACKLOG ? SuggestionSource() : <RatingArea />}
      {type === ListType.BACKLOG ? "" : CommentsArea()}{" "}
    </div>
  );

  const Favorite = (): React.ReactNode =>
    type !== ListType.BACKLOG && (
      <FavoriteButton
        isFavorite={isFavorite}
        onClick={() => setIsFavorite(!isFavorite)}
      />
    );

  const Continue = (): React.ReactNode => (
    <Button
      variant={type === ListType.BACKLOG ? "selected" : "accent"}
      className="rounded-full relative"
      onClick={() => addBookToList()}
    >
      <div className={`${loading ? "opacity-0" : ""}`}>I'm done</div>
      {loading && (
        <div className="absolute m-auto">
          <Loading />
        </div>
      )}
    </Button>
  );

  const Buttons = (): React.ReactNode => (
    <div className="flex flex-row gap-2">
      <Favorite />
      <Continue />
    </div>
  );

  return (
    <div className="flex flex-row justify-between items-end gap-2 modal-size modal-background">
      <BookThumbnail
        src={book.thumbnailUrl}
        title={book.title}
        className="pointer-events-none !h-full !w-96 !relative rounded-lg shadow-md"
        fill
      />
      <MainSection />
      <Buttons />
    </div>
  );
};

export default AddBookToList;
