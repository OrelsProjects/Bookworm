import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useBooksList from "../../../hooks/useBooksList";
import { BookInListWithBook } from "../../../models/bookInList";
import { TextArea } from "../../ui/textarea";
import { BooksListData } from "../../../models/booksList";
import { Logger } from "../../../logger";
import { CancelError } from "../../../models/errors/cancelError";

interface CommentAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  bookInList?: BookInListWithBook; // For book's comments
  bookListData?: BooksListData; // For list's comments
  listName?: boolean;
  onChanged?: (comments: string) => void;
  error?: string;
}

export const CommentsArea: React.FC<CommentAreaProps> = ({
  bookInList,
  bookListData: booksListData,
  listName,
  onChanged,
  error,
  ...props
}) => {
  const {
    updateBookInList,
    updateBooksList,
    cancelUpdateBooksList,
    cancelUpdateBookInList,
  } = useBooksList();
  const [comments, setComments] = useState("");
  const [previousComments, setPreviousComments] = useState("");
  const [loading, setLoading] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (listName) {
      setComments(booksListData?.name ?? "");
    } else if (bookInList?.comments) {
      setComments(bookInList.comments);
    } else {
      setComments(booksListData?.description ?? "");
    }
  }, [bookInList, booksListData]);

  useEffect(() => {
    if (comments !== previousComments) {
      handleOnChange();
    }
  }, [comments]);

  const handleUpdateList = async (booksListData: BooksListData) => {
    if (loading) {
      cancelUpdateBooksList(booksListData);
    }
    setLoading(true);
    try {
      const { curatorName, ...updateObject } = booksListData;
      if (listName) {
        updateObject.name = comments;
      } else {
        updateObject.description = comments;
      }
      await updateBooksList({ ...updateObject });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookInList = async (bookInList: BookInListWithBook) => {
    setLoading(true);
    try {
      const { book: book, ...rest } = bookInList;
      rest.comments = comments;
      await updateBookInList(rest);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      if (bookInList) {
        await handleUpdateBookInList(bookInList);
      } else if (booksListData) {
        await handleUpdateList(booksListData);
      }
      onChanged?.(comments);
    } catch (e: any) {
      if (e instanceof CancelError) {
        return;
      }
      Logger.error("Error updating in comments area", e);
      toast.error("Failed to update.. Let's try again 🛠️");
    }
  };

  const handleOnChange = () => {
    setPreviousComments(comments);
    if (timeout.current) {
      clearTimeout(timeout.current);
      if (loading) {
        if (bookInList) {
          cancelUpdateBookInList(bookInList);
        } else if (booksListData) {
          cancelUpdateBooksList(booksListData);
        }
        setLoading(false);
      }
    }
    const currentComments = listName
      ? booksListData?.name ?? ""
      : bookInList
      ? bookInList.comments
      : booksListData?.description ?? "";
    timeout.current = setTimeout(() => {
      if (currentComments !== comments) {
        handleUpdate();
      }
    }, 1000);
  };

  return (
    <TextArea
      rows={props.rows ?? 3}
      placeholder="Comment"
      {...props}
      loading={loading}
      onChange={(e) => {
        const value = e.target.value;
        props.onChange?.(e);
        setComments(value);
      }}
      value={props.value ?? comments}
      error={error}
    />
  );
};
