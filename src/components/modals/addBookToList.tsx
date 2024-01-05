import React, { useState } from "react";
import Image from "next/image";
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
    const toastId = toast.loading(`Adding ${book.title} to backlog`);
    try {
      await addUserBook(
        book,
        isFavorite,
        suggestionSource,
        comments,
        new Date().toISOString()
      );
      toast.success("Book added to backlog");
      dispatch(hideModal());
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const addBookToReadList = async () => {
    let toastId = toast.loading(`Adding ${book.title} to read list`);
    try {
      const userBook: UserBook | undefined = userBooksData.find(
        (userBookData) => compareBooks(userBookData.bookData.book, book)
      )?.userBook;

      if (!userBook) {
        console.log("userBook not found");
        return;
      }

      await updateUserBook({
        user_book_id: userBook.userBookId,
        reading_status_id: ReadingStatusEnum.READ,
        user_rating: ratingSelected,
        user_comments: comments,
        is_favorite: isFavorite,
      });
      toast.success("Book added to read list");
      dispatch(hideModal());
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const Title = (): React.ReactNode => (
    <div className="line-clamp-1 text-5xl">{book.title}</div>
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
        return "";
      case ListType.READ:
        return "The book was great!";
      default:
        return "";
    }
  };

  const CommentsArea = (): React.ReactNode => (
    <form className="w-comments h-36">
      <label htmlFor="comments after reading" className="">
        {commentsText()}
      </label>
      <TextArea
        key={`comments-after-read`}
        id="comments-after-read"
        className="w-full h-full bg-primary-weak rounded-lg text-white placeholder-gray-300 focus:outline-none border-none"
        placeholder={commentsPlaceholder()}
        value={comments}
        onChange={(e) => {
          e.preventDefault();
          setComments(e.target.value);
        }}
      />
    </form>
  );

  const SuggestionSource = (): React.ReactNode => (
    <form className="w-comments">
      <label htmlFor="suggestion-source" className="">
        Who recommeneded this book to you?
      </label>
      <Input
        type="text"
        key={`suggestion-source`}
        id="suggestion-source"
        className="w-full h-full bg-primary-weak rounded-lg text-white placeholder-gray-300 focus:outline-none border-none"
        placeholder=""
        value={suggestionSource}
        onChange={(e) => {
          e.preventDefault();
          setSuggestionSource(e.target.value);
        }}
      />
    </form>
  );

  return (
    <div className="flex flex-row justify-between items-end gap-2 h-144 modal-background">
      <Image
        src={book.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
        alt="Add book to backlog"
        fill
        className="text input pointer-events-none !h-full !w-96 !relative rounded-lg shadow-md"
      />
      <div className="h-full w-1/2 flex flex-col justify-center items-start my-4 gap-8">
        <Title />
        <Description />
        {type === ListType.BACKLOG ? SuggestionSource() : <RatingArea />}
        {CommentsArea()}{" "}
        {/* Avoid rerender when text changes in useState when using <CommentsArea/> */}
      </div>
      {type !== ListType.BACKLOG && (
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={() => setIsFavorite(!isFavorite)}
        />
      )}
      {
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
      }
    </div>
  );
};

export default AddBookToList;
