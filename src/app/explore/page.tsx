"use client";

import { SearchBarComponent } from "../../components/search/searchBarComponent";
import SearchBarIcon from "../../components/search/searchBarIcon";

interface ExplorePageProps {}

const ExplorePage: React.FC<ExplorePageProps> = () => {
  return (
    <div>
      <SearchBarIcon>
        <SearchBarComponent
          // onChange={(value: string) => searchBooks(value)}
          // onSubmit={(value: string) => searchBooks(value)}
          placeholder="Search Readlists..."
          className="pr-16"
        />
      </SearchBarIcon>
    </div>
  );
};

export default ExplorePage;
