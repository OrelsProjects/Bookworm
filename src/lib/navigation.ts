"use client";

import { useRouter } from "next/router";

export const navigateToSeeAllBooksLists = () => {
  const router = useRouter();
  router.push("/see-all/books-lists");
};
