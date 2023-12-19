"use client";

import React from "react";

import BooksTable from "../../components/booksTable/booksTable";
import ToggleButtons from "../../components/toggleButtons";

export default function Home(): React.ReactNode {
  return (
    <div className="w-full h-full flex justify-start item-start flex-col">
      <div className="w-full ">
        <ToggleButtons
          labels={["To read", "Books I’ve read"]}
          onToggle={(index) => console.log(index)}
        />
      </div>
      <BooksTable />
    </div>
  );
}
