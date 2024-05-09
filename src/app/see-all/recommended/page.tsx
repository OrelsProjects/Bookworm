"use client";

import React, { useMemo } from "react";
import { Button } from "../../../components/ui/button";
import Tabs from "../../../components/ui/tabs";
import {
  RecommentionFilterTypes as RecommendationFilterTypes,
  sorterTabItems,
} from "../_consts";
import { TabItem } from "../../../components/ui/tabs";
import { BookFilter } from "../../../hooks/useBook";
import { SearchBarComponent } from "../../../components/search/searchBarComponent";
import Dropdown from "../../../components/ui/dropdown";
import { Checkbox } from "../../../components/ui/checkbox";
import { Filter } from "../../../components/icons/filter";
import { ExpandType } from "../../../components/animationDivs";
import { FaBars } from "react-icons/fa6";
import useRecommendations, {
  RecommendationSort,
} from "../../../hooks/useRecommendations";
import RecommendationsList from "../../../components/booksList/recommendationsList";
import { unslugifyText } from "../../../utils/textUtils";

export default function MyLibrary({
  params,
}: {
  params: { status?: string };
}): React.ReactNode {
  const {
    sort,
    filter,
    search,
    sortedBy,
    filteredWith,
    allRecommendations,
    filteredRecommendations,
  } = useRecommendations();

  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);

  const genres = useMemo((): string[] => {
    return allRecommendations
      .flatMap((r) => r.genres || "")
      .filter((genre) => genre);
  }, [allRecommendations]);

  const onSortClick = (tabItem: TabItem) => {
    sort(tabItem.value as RecommendationSort);
  };

  const onFilterClick = (
    filterValue: RecommendationFilterTypes,
    value: string
  ) => {
    filter(filterValue, value);
  };

  const filtersValues = useMemo((): string[] => {
    return Object.values(filteredWith || {}).flatMap((value) => value) || [];
  }, [filteredWith]);

  const filterGenreDropdownText = useMemo(() => {
    if (filtersValues.length === 0) return "Genres";
    if (filtersValues.length === 1) return filtersValues[0];
    return `Multi-genres`;
  }, [filteredWith]);

  const ListFilter = ({ filter }: { filter: BookFilter }) => (
    <>
      <Button
        key={`tab-filter-${filter}`}
        onClick={(e) => {
          e.stopPropagation();
          setShowFilterDropdown(!showFilterDropdown);
        }}
        variant="outline"
        className={`rounded-full flex-shrink-0 !min-w-20 h-6 p-4 w-max max-w-[70%]
              ${filtersValues.length > 0 ? "bg-primary" : ""}
              `}
      >
        <div className="w-fit flex flex-row gap-1 justify-start items-center truncate">
          <Filter.Fill
            className="!text-foreground flex-shrink-0"
            iconSize="xs"
          />
          {filterGenreDropdownText}
        </div>
      </Button>
      {showFilterDropdown && (
        <div className="absolute top-full left-0 mt-1 z-40">
          <Dropdown
            className="!w-fit min-w-[40%] max-w-[70%] max-h-56 overflow-auto"
            expandType={ExpandType.TopRight}
            closeOnSelection={false}
            items={genres.map((genre) => {
              return {
                label: unslugifyText(genre),
                leftIcon: (
                  <Checkbox
                    className="h-4 w-4 flex-shrink-0"
                    checked={
                      filteredWith?.["genres"]?.find((f) => f === genre)
                        ? true
                        : false
                    }
                  />
                ),
                onClick: () => onFilterClick("genres", genre),
              };
            })}
            onClose={() => setShowFilterDropdown(false)}
          />
        </div>
      )}
    </>
  );

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <SearchBarComponent
        onChange={(value: string) => search(value)}
        onSubmit={(value: string) => search(value)}
        placeholder="Search in Your Books..."
        className="pr-16"
      />

      <div className="h-full flex flex-col gap-[30px] overflow-auto">
        <div className="flex flex-col gap-[25px]">
          <Tabs
            Title={() => <div className="text-2xl">Sort by</div>}
            items={sorterTabItems}
            onClick={onSortClick}
            defaultSelected={
              sortedBy.length > 0
                ? sorterTabItems.find((t) => t.value === sortedBy[0])
                : undefined
            }
            selectable
          />
          <div className="flex flex-col gap-2.5 relative">
            <div className="text-2xl">Filter by</div>
            <ListFilter filter="readlist" />
          </div>
        </div>
        <div className="flex flex-col gap-[25px]">
          <div className="flex flex-row gap-1 justify-start items-center">
            <FaBars className="w-[17.5px] h-[15px]" />
            <span className="text-2xl">Recommended for you</span>
          </div>
          <RecommendationsList lists={filteredRecommendations} />
        </div>
      </div>
    </div>
  );
}
