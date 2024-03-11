import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useBooksList from "../../../hooks/useBooksList";
import { BookInListWithBook } from "../../../models/bookInList";
import { TextArea } from "../../textarea";
import { BooksListData } from "../../../models/booksList";

interface CommentAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  bookInList?: BookInListWithBook; // For book's comments
  bookListData?: BooksListData; // For list's comments
}

export const CommentsArea: React.FC<CommentAreaProps> = ({
  bookInList,
  bookListData,
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
    setComments(
      bookInList?.comments
        ? bookInList.comments
        : bookListData?.description ?? ""
    );
  }, [bookInList, bookListData]);

  useEffect(() => {
    if (comments !== previousComments) {
      handleOnChange();
    }
  }, [comments]);

  const handleUpdateList = async (bookListData: BooksListData) => {
    if (loading) {
      cancelUpdateBooksList();
    }
    setLoading(true);
    try {
      await updateBooksList({
        ...bookListData,
        description: comments,
      });
      setLoading(false);
    } catch (e: any) {
      toast.error("Failed to update.. We are on it 🛠️");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookInList = async (bookInList: BookInListWithBook) => {
    if (loading) {
      cancelUpdateBookInList();
    }
    setLoading(true);
    try {
      const { book, ...rest } = bookInList;
      rest.comments = comments;
      await updateBookInList(rest);
      setLoading(false);
    } catch (e: any) {
      toast.error("Failed to update.. We are on it 🛠️");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (bookInList) {
      await handleUpdateBookInList(bookInList);
    } else if (bookListData) {
      await handleUpdateList(bookListData);
    }
  };

  const handleOnChange = () => {
    setPreviousComments(comments);
    if (timeout.current) {
      clearTimeout(timeout.current);
      if (loading) {
        if (bookInList) {
          cancelUpdateBookInList();
        } else if (bookListData) {
          cancelUpdateBooksList();
        }
        setLoading(false);
      }
    }
    const currentComments = bookInList
      ? bookInList.comments
      : bookListData?.description ?? "";
    timeout.current = setTimeout(() => {
      if (currentComments !== comments) {
        handleUpdate();
      }
    }, 1000);
  };

  return (
    <TextArea
      value={comments}
      rows={3}
      onChange={(e) => {
        const value = e.target.value;
        setComments(value);
      }}
      placeholder="Comment"
      loading={loading}
      {...props}
    />
  );
};
