"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBarComponent } from "@/src/components/search/searchBarComponent";
import useTable from "@/src/hooks/useTable";
import BookList from "@/src/components/book/bookList";
import BooksListList from "@/src/components/booksList/booksListList";
import { Plus } from "@/src/components/icons/plus";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Logger } from "@/src/logger";
import { useModal } from "@/src/hooks/useModal";
import { selectAuth } from "@/src/lib/features/auth/authSlice";
import useBooksList from "@/src/hooks/useBooksList";
import { EmptyList } from "@/src/components/emptyList";
import { SeeAll } from "@/src/components/ui/seeAll";
import { EventTracker } from "@/src/eventTracker";

const MyLists = ({ params }: { params: { listUrl?: string } }) => {
  const router = useRouter();
  const { user } = useSelector(selectAuth);
  const { booksLists, searchInBooksList, getBooksList } = useBooksList();
  const { userBooks, nextPage, searchBooks, searchValue } = useTable();
  const { showBooksListModal, showBooksListEditModal } = useModal();
  const [loadingBooksList, setLoadingBooksList] = useState(false);

  const loadBooksList = async () => {
    try {
      showBooksListModal({}, { loading: true });
      const booksList = await getBooksList(params.listUrl);
      if (booksList) {
        router.push(`/lists/${params.listUrl}`);
      } else {
        router.push("/lists");
      }
    } catch (error: any) {
      Logger.error("Error getting books lists", {
        error,
      });
      router.push("/404");
    } finally {
      setLoadingBooksList(false);
    }
  };

  useEffect(() => {
    if (params.listUrl) {
      if (loadingBooksList || !params.listUrl) return;
      setLoadingBooksList(true);
      loadBooksList();
    }
  }, []);

  useEffect(() => {
    if (!params.listUrl) {
      setLoadingBooksList(false);
    }
  }, [params.listUrl, window.location]);

  const onSeeAllClick = useCallback(() => {
    router.push("/my-library/read");
  }, [router]);

  const onAddListClick = () => showBooksListEditModal();

  const UserBooks = () => (
    <div className="w-full h-fit flex flex-col gap-5">
      <SeeAll title="My Library" onClick={onSeeAllClick} />
      <BookList readStatus="read" direction="row" thumbnailSize="2xl" showAdd />
    </div>
  );

  const UserBooksLists = () => (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="text-list-title">My Readlists</div>
        <div>
          <Plus.Fill
            className="!text-foreground"
            iconSize="sm"
            onClick={onAddListClick}
          />
        </div>
      </div>
      {booksLists.length === 0 ? (
        <EmptyList searchValue={searchValue} />
      ) : (
        <BooksListList
          direction="column"
          disableScroll
          booksListsData={booksLists}
          bookThumbnailSize="lg"
          bottomElementProps={{
            onAddBookClick: (list) => showBooksListEditModal(list),
            onShareClick: (list) => {
              const baseUrl = window.location.origin;
              navigator.clipboard.writeText(
                `${baseUrl}${list.publicURL}` ?? ""
              );
              EventTracker.track("Link copied to clipboard", {
                listId: list.listId,
              });
              toast.success("Link copied to clipboard!");
            },
          }}
        />
      )}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col gap-10 pb-4">
      <SearchBarComponent
        onChange={(value: string) => {
          searchInBooksList(value);
          searchBooks(value);
        }}
        onSubmit={(value: string) => {
          searchInBooksList(value);
          searchBooks(value);
        }}
        placeholder="Search in Your Books..."
      />
      <div className="h-full w-full flex gap-10 flex-grow flex-col overflow-auto md:pb-16">
        <UserBooks />
        <UserBooksLists />
      </div>
    </div>
  );
};

export default MyLists;
