import { TabItem } from "../../../components/tabs";
import { FaFilter } from "react-icons/fa6";
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

export const filterTabItems: TabItem[] = [
  {
    label: "Author",
    value: "Author",
  },
  {
    label: "Published Year",
    value: "Published Year",
  },
  {
    label: "Read list",
    value: "Read list",
    icon: <FaFilter />,
  },
];
