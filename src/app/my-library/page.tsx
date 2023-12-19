"use client";

import React, { useEffect } from "react";
import SearchBar from "../../components/search/searchBar";
import toast from "react-hot-toast";

export default function Home(): React.ReactNode {
  useEffect(() => {
    // toast.success("Welcome to Bookworm!");
  }, []);

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
