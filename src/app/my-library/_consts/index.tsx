import { TabItem } from "../../../components/tabs";
import { BookSort } from "../../../hooks/useBook";

export const sorterTabItems: TabItem[] = [
  {
    label: "Recently Added",
    value: BookSort.DateAdded,
  },
  {
    label: "Title",
    value: BookSort.Title,
  },
  {
    label: "Author",
    value: BookSort.Author,
  },
];
