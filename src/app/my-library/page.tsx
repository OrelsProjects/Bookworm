"use client";

import React from "react";
import SearchBar from "../../components/search/searchBar";

export default function Home(): React.ReactNode {
  return (
    <div className="h-screen v-screen">
      <div className="w-full h-full z-30">
        <div className="w-full z-30">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
