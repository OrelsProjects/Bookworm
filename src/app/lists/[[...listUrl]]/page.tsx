"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBarComponent } from "../../../components/search/searchBarComponent";
import useTable from "../../../hooks/useTable";
import BookList from "../../../components/book/bookList";
import BooksListList from "../../../components/booksList/booksListList";
import { Add } from "../../../components/icons/add";
import { Plus } from "../../../components/icons/plus";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { SafeBooksListData } from "../../../models/booksList";
import { IResponse } from "../../../models/dto/response";
import { Logger } from "../../../logger";
import Loading from "../../../components/ui/loading";
import { useModal } from "../../../hooks/useModal";
import { selectAuth } from "../../../lib/features/auth/authSlice";
import SearchBarIcon from "../../../components/search/searchBarIcon";
import useBooksList from "../../../hooks/useBooksList";
import { EmptyList } from "../../../components/emptyList";

const MyLists = ({ params }: { params: { listUrl?: string } }) => {
  const router = useRouter();
  const { user } = useSelector(selectAuth);
  const { booksLists, searchInBooksList } = useBooksList();
  const { userBooks, nextPage, searchBooks, searchValue } = useTable();
  const { showBooksListModal, showBooksListEditModal } = useModal();
  const [loadingBooksList, setLoadingBooksList] = useState(false);

  const loadBooksList = async () => {
    try {
      showBooksListModal({}, { loading: true });
      const userBooksList = booksLists.find(
        (list) => list.publicURL === params.listUrl
      );
      if (userBooksList) {
        showBooksListModal(
          {
            bookList: userBooksList,
          },
          {
            onBack: () => {
              router.push("/home");
            },
          }
        );
        return;
      }
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
        if (!user) {
          localStorage.setItem("listReferer", window.location.pathname); // Set referrer.
          showBooksListModal(
            {
              bookList,
            },
            {
              onBack: () => {
                router.push("/home");
              },
              popLast: true,
              shouldAnimate: false,
            }
          );
        } else {
          showBooksListModal(
            { bookList },
            {
              popLast: true,
              shouldAnimate: false,
              onBack: () => {
                router.push("/lists");
              },
            }
          );
        }
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
    router.push("/my-library");
  }, [router]);

  const onAddListClick = () => showBooksListEditModal();

  const UserBooks = () => (
    <div className="w-full h-fit flex flex-col gap-5">
      <div className="w-full flex flex-row justify-between items-end">
        <div className="text-list-title">My Library</div>
        <h2 className="text-see-all" onClick={onSeeAllClick}>
          See all
        </h2>
      </div>
      <BookList
        books={userBooks.map((ubd) => ubd.bookData.book)}
        onNextPageScroll={nextPage}
        direction="row"
        thumbnailSize="2xl"
      />
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
              toast.success("Link copied to clipboard!");
            },
          }}
        />
      )}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col gap-10 pb-4">
      <SearchBarIcon>
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
          className="pr-16"
        />
      </SearchBarIcon>
      <div className="flex gap-10 flex-grow flex-col h-full">
        <UserBooks />
        <UserBooksLists />
      </div>
    </div>
  );
};

export default MyLists;
