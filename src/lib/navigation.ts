"use client";

import { useRouter } from "next/navigation";

const useNavigation = () => {
  const router = useRouter();

  const navigateToSeeAllBooksLists = () => {
    router.push("/see-all/books-lists");
  };

  const navigateToBooksListView = (listUrl: string) => {
    router.push(`${listUrl}`);
  };

  const navigateToBookInList = (listUrl: string, bookName: string) => {
    router.push(`${listUrl}/${bookName}`);
  };

  return {
    navigateToSeeAllBooksLists,
    navigateToBooksListView,
  };
};

export default useNavigation;
