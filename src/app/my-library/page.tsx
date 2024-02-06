"use client";

import React from "react";
import BooksTable from "../../components/booksTable/booksTable";
import dynamic from "next/dynamic";

export function MyLibrary(): React.ReactNode {
  return (
    <div className="w-full h-full flex justify-start item-start flex-col gap-6">
      <BooksTable />
    </div>
  );
}

export default dynamic(() => Promise.resolve(MyLibrary), {
  ssr: false,
});