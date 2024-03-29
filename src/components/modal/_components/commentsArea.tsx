import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useBooksList from "../../../hooks/useBooksList";
import { BookInListWithBook } from "../../../models/bookInList";
import { TextArea } from "../../ui/textarea";
import { BooksListData } from "../../../models/booksList";

interface CommentAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  bookInList?: BookInListWithBook; // For book's comments
  bookListData?: BooksListData; // For list's comments
  listName?: boolean;
  error?: string;
}

export const CommentsArea: React.FC<CommentAreaProps> = ({
  bookInList,
  bookListData,
  listName,
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
      setComments(bookListData?.name ?? "");
    } else if (bookInList?.comments) {
      setComments(bookInList.comments);
    } else {
      setComments(bookListData?.description ?? "");
    }
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
      const { curatorName, ...updateObject } = bookListData;
      if (listName) {
        updateObject.name = comments;
      } else {
        updateObject.description = comments;
      }
      await updateBooksList({ ...updateObject });
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
    const currentComments = listName
      ? bookListData?.name ?? ""
      : bookInList
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
