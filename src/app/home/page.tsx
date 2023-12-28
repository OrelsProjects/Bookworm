"use client";

import React from "react";
import SearchBar from "../../components/search/searchBar";
import { Modal } from "@/src/components";
import BookDetails from "@/src/components/modals/bookDescription";

export default function Home(): React.ReactNode {

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="h-full w-full relative flex flex-col justify-top items-start z-30 gap-16">
      <div className="flex flex-col justify-start items-start gap-2">
        <p className="text-6.5xl">Organize Your Literary World</p>
        <p className="text-lg leading-6">
          Discover, Sort and Savour Your Personal Library with Ease
        </p>
      </div>
      <SearchBar/>
    </div>
  );
}
