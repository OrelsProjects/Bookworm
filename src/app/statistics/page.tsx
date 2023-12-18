"use client";

import React from "react";
import SearchBar from "../../components/search/searchBar";

export default function Home(): React.ReactNode {
  return (
    <div className="w-full h-full">
      <SearchBar />
    </div>
  );
}
