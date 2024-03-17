"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchBarComponent } from "../../../components/search/searchBarComponent";
import useTable from "../../../hooks/useTable";
import BookList from "../../../components/book/bookList";
import BooksListList from "../../../components/booksList/booksListList";
import { Add } from "../../../components/icons/add";
import { Plus } from "../../../components/icons/plus";
import { useSelector } from "react-redux";
import { selectBooksLists } from "../../../lib/features/booksLists/booksListsSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { SafeBooksListData } from "../../../models/booksList";
import { IResponse } from "../../../models/dto/response";
import { Logger } from "../../../logger";
import Loading from "../../../components/loading";
import { useModal } from "../../../hooks/useModal";

const MyLists = ({ params }: { params: { listUrl?: string } }) => {
  const { showBooksListModal, showBooksListEditModal } = useModal();
  const router = useRouter();
  const { booksListsData } = useSelector(selectBooksLists);
  const { userBooks, nextPage, searchBooks } = useTable();
  const loadingBooksList = useRef(false);

  const loadBooksList = async () => {
    try {
      const urlParams = new URLSearchParams();
      urlParams.append("url", params.listUrl ?? "");
      const response = await axios.get<IResponse<SafeBooksListData>>(
        "/api/list",
        {
          params: urlParams,
        }
      );
      const bookList = response.data.result;
      if (bookList) {
        showBooksListModal(bookList);
      }
    } catch (error: any) {
      Logger.error("Error getting books lists", {
        error,
      });
      router.push("/404");
    } finally {
      loadingBooksList.current = false;
    }
  };

  useEffect(() => {
    if (params.listUrl) {
      if (loadingBooksList.current || !params.listUrl) return;
      loadingBooksList.current = true;
      loadBooksList();
    }
  }, []);

  useEffect(() => {
    if (!params.listUrl) {
      loadingBooksList.current = false;
    }
  }, [params.listUrl]);

  const onSeeAllClick = useCallback(() => {
    router.push("/my-library");
  }, [router]);

  const onAddListClick = () => showBooksListEditModal();

  const UserBooks = () => (
    <div className="w-full h-fit flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between">
        <div className="text-xl font-bold">My Library</div>
        <div className="text-lg font-bold underline" onClick={onSeeAllClick}>
          See all
        </div>
      </div>
      <BookList
        books={userBooks.map((ubd) => ubd.bookData.book)}
        onNextPageScroll={nextPage}
        direction="row"
        thumbnailSize="lg"
      />
    </div>
  );

  const EmptyList = () => (
    <div className="mt-3 w-fit h-fit flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-base font-bold">
          You have no Readlists for now :(
        </div>
        <div className="text-base font-light">
          Ready to create and share your Readlist with friends? Spread the joy
          of reading by inviting them to join in!
        </div>
      </div>

      <div
        className="w-full h-fit flex flex-row gap-2 rounded-full text-background bg-foreground p-2"
        onClick={onAddListClick}
      >
        <Add.Fill className="!text-background" iconSize="sm" />
        Create your first shareable Readlist
      </div>
    </div>
  );

  const UserBooksLists = () => (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between">
        <div className="text-xl font-bold">My Readlists</div>
        <div>
          <Plus.Fill
            className="!text-foreground"
            iconSize="sm"
            onClick={onAddListClick}
          />
        </div>
      </div>
      {booksListsData.length === 0 ? (
        <EmptyList />
      ) : (
        <BooksListList
          direction="column"
          disableScroll
          booksListsData={booksListsData}
          bookThumbnailSize="md"
          bottomElementProps={{
            onAddBookClick: (list) => showBooksListModal(list),
            onShareClick: (list) => {
              const baseUrl = window.location.origin;
              navigator.clipboard.writeText(
                `${baseUrl}${list.publicURL}` ?? ""
              );
              toast.success("Link copied to clipboard!");
            },
          }}
        />
      )}
    </div>
  );

  if (loadingBooksList.current) {
    return <Loading spinnerClassName="w-12 h-12" />;
  }
  return (
    <div className="h-full w-full flex flex-col gap-4 pb-4">
      <div className="h-fit">
        <SearchBarComponent
          onChange={(value: string) => searchBooks(value)}
          onSubmit={(value: string) => searchBooks(value)}
          placeholder="Search in Your Books..."
        />
      </div>
      <div className="flex gap-3 flex-grow flex-col h-full overflow-auto scrollbar-hide">
        <UserBooks />
        <UserBooksLists />
      </div>
    </div>
  );
};

export default MyLists;
