import React, { useState } from "react";
import Image from "next/image";
import { Book, UserBookData } from "@/src/models";
import { RatingStar } from "../rating";
import { TextArea } from "../textarea";
import { FavoriteButton } from "../buttons/bookButtons";
import { Button } from "../button";
import useBook from "@/src/hooks/useBook";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { ReadingStatusEnum } from "@/src/models/readingStatus";
import toast from "react-hot-toast";
import Loading from "../loading";
import { compareBooks } from "@/src/models/book";

interface AddBookToBacklogProps {
  book: Book;
}

const AddBookToReadList: React.FC<AddBookToBacklogProps> = ({ book }) => {
  const { updateUserBook, loading } = useBook();
  const userBooksData: UserBookData[] = useSelector(
    (state: RootState) => state.userBooks.userBooksData
  );

  const addBookToList = async () => {
    try {
      const userBook = userBooksData.find((userBookData) =>
        compareBooks(userBookData.bookData.book, book)
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
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const [ratingSelected, setRatingSelected] = useState<number>(0);
  const [comments, setComments] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // const addBookToList = async () => {
  //   await addUserBook(bookData, ratingSelected, comments, isFavorite);

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

  const CommentsArea = (): React.ReactNode => (
    <form className="w-comments h-36">
      <label htmlFor="comments after reading" className="">
        Comments after reading (optional)
      </label>
      <TextArea
        key={`comments-after-read`}
        id="comments-after-read"
        className="w-full h-full bg-primary-weak rounded-lg text-white placeholder-gray-300 focus:outline-none border-none"
        placeholder="The book was great!"
        value={comments}
        onChange={(e) => {
          e.preventDefault();
          setComments(e.target.value);
        }}
      />
    </form>
  );

  return (
    <div className="flex flex-row justify-start items-end gap-2 h-144">
      <Image
        src={book.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
        alt="Add book to backlog"
        fill
        className="text input pointer-events-none !h-full !w-96 !relative rounded-lg shadow-md"
      />
      <div className="h-full w-1/2 flex flex-col justify-center items-start m-10 gap-8">
        <Title />
        <Description />
        <RatingArea />
        {CommentsArea()}{" "}
        {/* Avoid rerender when text changes in useState when using <CommentsArea/> */}
      </div>
      <FavoriteButton
        isFavorite={isFavorite}
        onClick={() => setIsFavorite(!isFavorite)}
      />
      {
        <Button
          variant="accent"
          className="rounded-full relative"
          onClick={() => addBookToList()}
        >
          <div className={`${loading ? "opacity-0" : ""}`}>I've read it</div>
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

export default AddBookToReadList;
