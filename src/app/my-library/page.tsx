"use client";

import React, { useState } from "react";

import BooksTable, { TableType } from "../../components/booksTable/booksTable";
import ToggleButtons from "../../components/toggleButtons";
import { set } from "lodash";

export default function Home(): React.ReactNode {
  const [selectedTableType, setSelectedTableType] = useState(TableType.READ);
  console.log(selectedTableType);
  return (
    <div className="w-full h-full flex justify-start item-start flex-col gap-6">
      <div className="w-full ">
        <ToggleButtons
          values={[
            { type: TableType.READ, label: "Books I've Read" },
            { type: TableType.TO_READ, label: "To Read" },
          ]}
          onToggle={(type: TableType) => setSelectedTableType(type)}
        />
      </div>
      <BooksTable type={selectedTableType} />
    </div>
  );
}
