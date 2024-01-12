"use client";

import React from "react";
import SearchBar from "../../components/search/searchBar";

export default function Home(): React.ReactNode {
  return (
    <div className="h-full w-full relative flex flex-col justify-top items-start z-30 gap-6">
      <div className="hidden 2xl:flex flex-col justify-start items-start">
        <p className="text-6.5xl">Organize Your Literary World</p>
        <p className="text-lg leading-6">
          Discover, Sort and Savour Your Personal Library with Ease
        </p>
      </div>
      <SearchBar />
    </div>
  );
}
