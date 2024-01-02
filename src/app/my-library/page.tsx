"use client";

import React, { useState } from "react";

import BooksTable, { TableType } from "../../components/booksTable/booksTable";
import ToggleButtons from "../../components/toggleButtons";

export default function Home(): React.ReactNode {
  const [selectedTableType, setSelectedTableType] = useState(TableType.TO_READ);

  return (
    <div className="w-full h-full flex justify-start item-start flex-col gap-6">
      <BooksTable />
    </div>
  );
}
