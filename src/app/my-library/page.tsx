"use client";

import React from "react";
import BooksTable from "../../components/booksTable/booksTable";

export default function Home(): React.ReactNode {
  return (
    <div className="w-full h-full flex justify-start item-start flex-col gap-6">
      <BooksTable />
    </div>
  );
}
