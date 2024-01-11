"use client";

import React, { useEffect } from "react";

import BooksTable from "../../components/booksTable/booksTable";

export default function Home(): React.ReactNode {
  useEffect(() => {
    console.log("home page visited");

    // console.log(captureResult);
  }, []);

  return (
    <div className="w-full h-full flex justify-start item-start flex-col gap-6">
      <BooksTable />
    </div>
  );
}
