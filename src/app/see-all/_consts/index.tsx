import { TabItem } from "../../../components/ui/tabs";

export const sorterTabItems: TabItem[] = [
  {
    label: "Match",
    value: "Match",
  },
  // {
  //   label: "Rating",
  //   value: "Rating",
  // },
  {
    label: "Views",
    value: "Views",
  },
];

// filters are possible keys of SafeBooksListData. Specifically, only genres
export type RecommentionFilterTypes = "genres";
// This type maps filters to an array of values that can be used to filter the recommendations
export type RecommendationFilters = {
  [key in RecommentionFilterTypes]: string[];
};
